const mqtt = require('mqtt');
const config = require('../config');
const logger = require('../util/logger');

class MqttSubscriptionManager {
  constructor() {
    this.connected = false;
    this.queue = [];

    this.topicHandlers = {};
    this.pendingMessages = {};

    this.client = mqtt.connect({
      host: config.mqtt.host,
      port: config.mqtt.port,
    });
    logger.info('Connecting to MQTT broker...');

    this.client.on('connect', () => {
      logger.debug('Connected to MQTT broker', config.mqtt.host);
      this.connected = true;

      this.queue.forEach(({ topic, handler }) => {
        this.subscribe(topic, handler);
      });
      this.queue = [];
    });

    this.client.on('message', (receivedTopic, messageBuffer) => {
      const messageStr = messageBuffer.toString();
      // Compare against each pattern in topicHandlers
      Object.entries(this.topicHandlers).forEach(([pattern, handlers]) => {
        if (this._topicMatchesPattern(receivedTopic, pattern)) {
          if (messageStr) {
            for (const handler of handlers) {
              let message;
              try {
                message = JSON.parse(messageStr);
              } catch {
                logger.debug('Message is not JSON:', messageStr);
                message = messageStr;
              }
              handler(receivedTopic, message);
            }
          }
        } else {
          if (!this.pendingMessages[receivedTopic]) {
            this.pendingMessages[receivedTopic] = [];
          }
          this.pendingMessages[receivedTopic].push({
            messageStr,
            timestamp: Date.now(),
          });

          setTimeout(() => {
            if (this.pendingMessages[receivedTopic]) {
              this.pendingMessages[receivedTopic] = this.pendingMessages[
                receivedTopic
              ].filter((msg) => Date.now() - msg.timestamp < 1000);
              if (this.pendingMessages[receivedTopic].length === 0) {
                delete this.pendingMessages[receivedTopic];
              }
            }
          }, 1000);
        }
      });
    });
  }

  subscribe(pattern, handler) {
    if (!this.connected) {
      this.queue.push({ topic: pattern, handler });
      logger.debug(`Queueing subscription to topic ${pattern}`);
      return;
    }

    if (this.topicHandlers[pattern]) {
      logger.debug(`Already subscribed to topic ${pattern}`);
      this.topicHandlers[pattern].push(handler);
      return;
    }
    this.client.subscribe(pattern, (err) => {
      if (err) {
        logger.error(`Failed to subscribe to topic ${pattern}: ${err}`);
        return;
      }
      logger.info(`Subscribed to topic ${pattern}`);
      this.topicHandlers[pattern] = [handler];

      if (this.pendingMessages[pattern]) {
        for (const { messageStr } of this.pendingMessages[pattern]) {
          let message;
          try {
            message = JSON.parse(messageStr);
          } catch {
            logger.debug('Message is not JSON:', messageStr);
            message = messageStr;
          }
          handler(pattern, message);
        }
        delete this.pendingMessages[pattern];
      }
    });
  }

  unsubscribe(pattern, handler) {
    if (!this.topicHandlers[pattern] || !handler) {
      logger.error(`Not subscribed to topic ${pattern} or no handler provided`);
      return;
    }

    const foundHandler = this.topicHandlers[pattern].findIndex(
      (h) => h === handler
    );
    if (foundHandler === -1) {
      logger.error(`Handler not found for topic ${pattern}`);
      return;
    }
    this.topicHandlers[pattern].splice(foundHandler, 1);

    if (this.topicHandlers[pattern].length === 0) {
      delete this.topicHandlers[pattern];
      this.client.unsubscribe(pattern, (err) => {
        if (err) {
          logger.error(`Failed to unsubscribe from topic ${pattern}: ${err}`);
          return;
        }
        logger.info(`Unsubscribed from topic ${pattern}`);
      });
    }
  }
  /**
   * Publish a message to a topic.
   *
   * @param {string} topic - The topic to publish to (cannot contain wildcards).
   * @param {string|Buffer} message - The payload to publish.
   * @param {Function} [callback] - Optional callback to be invoked once the publish is complete.
   * @param {{ messageType: 'json' | 'raw' }} [options] - Additional options for the message.
   */
  publish(topic, message, callback, options = {}) {
    switch (options.messageType) {
      case 'json':
        message = JSON.stringify(message);
        break;
      case 'raw':
        message = message ? Buffer.from(message) : '';
        break;
      default:
        message = JSON.stringify(message);
    }
    this.client.publish(topic, message, {}, (err, packet) => {
      if (callback && packet) {
        return callback(packet);
      }
      if (err) {
        console.error(`Failed to publish to "${topic}":`, err);
      }
    });
  }

  end(force = false, callback) {
    this.client.end(force, () => {
      logger.info('MQTT client disconnected');
      if (callback) {
        callback();
      }
    });
  }

  /**
   * Checks if an MQTT topic matches a subscription pattern.
   *
   * Supports MQTT wildcards:
   * - '#' matches any number of levels (including zero)
   * - '+' matches exactly one level
   *
   * @param {string} actualTopic - The topic received from the broker.
   * @param {string} pattern - The subscription pattern (may include wildcards).
   * @returns {boolean} True if the topic matches the pattern, false otherwise.
   */
  _topicMatchesPattern(actualTopic, pattern) {
    const patternSegments = pattern.split('/');
    const topicSegments = actualTopic.split('/');

    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const topicSegment = topicSegments[i];

      // If pattern segment is '#', it matches everything beyond (and including) this level
      if (patternSegment === '#') {
        return true;
      }

      // If pattern segment is '+', it matches exactly one segment
      if (patternSegment === '+') {
        // If actualTopic doesn't have a segment for '+', mismatch
        if (!topicSegment) {
          return false;
        }
      } else {
        // Exact match check
        if (patternSegment !== topicSegment) {
          return false;
        }
      }
    }

    // If pattern is fully matched but the actual topic has more segments,
    // they only match if pattern ended with '#'.
    return topicSegments.length === patternSegments.length;
  }
}
const subscriptionManager = new MqttSubscriptionManager();

/**
 * Subscribes to request and response topics, sends a request, and waits for a response.
 * If the timeout exceeds, it unsubscribes from the topics and rejects the promise.
 *
 * @param {Object} params
 * @param {string} params.requestTopic - The topic to publish the request to.
 * @param {any} params.payload - The payload to send with the request.
 * @param {string} params.responseTopic - The topic to subscribe to for the response.
 * @param {number} params.timeout - The timeout in milliseconds.
 * @returns {Promise<any>} - Resolves with the response payload or rejects with an error.
 * @throws {Error} - If the request times out.
 */
exports.requestResponseHandler = async ({
  requestTopic,
  payload,
  responseTopic,
  timeout = 5000,
}) => {
  return new Promise((resolve, reject) => {
    const handler = (topic, message) => {
      clearTimeout(timeoutId);
      subscriptionManager.unsubscribe(responseTopic, handler);
      resolve(message);
    };

    const timeoutId = setTimeout(() => {
      subscriptionManager.unsubscribe(responseTopic, handler);
      reject(new Error('Request timed out'));
    }, timeout);

    subscriptionManager.subscribe(responseTopic, handler);
    subscriptionManager.publish(requestTopic, payload);
  });
};
exports.subscriptionManager = subscriptionManager;
