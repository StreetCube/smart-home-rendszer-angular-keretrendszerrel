const EventEmitter = require('events');
const logger = require('../util/logger');
const { requestResponseHandler } = require('../controllers/mqttController');
const ZIGBEE2MQTT_EVENTS = require('../mqtt/mqtt.constants').ZIGBEE2MQTT_EVENTS;
const TOPICS = require('../mqtt/mqtt.constants').TOPICS;
const mqtt = require('../controllers/mqttController').subscriptionManager;
const ZigbeeDevice = require('../controllers/zigbeeDevice');

class ZigbeeDriver extends EventEmitter {
  constructor() {
    super();

    /**
     * @type {{[key: string]: ZigbeeDevice}}
     * */
    this.devices = {};

    this.Z2MState = { state: 'offline' };
    this.firstTime = true;

    this._handleStateChange = this._handleStateChange.bind(this);
    this._handleDevicesList = this._handleDevicesList.bind(this);
    this._handleBridgeInfo = this._handleBridgeInfo.bind(this);
    this._handleBridgeEvents = this._handleBridgeEvents.bind(this);

    mqtt.subscribe(TOPICS.BRIDGE.STATE, this._handleStateChange);

    this.stopInclusion();
  }

  _handleStateChange(topic, payload) {
    logger.debug(
      '[_handleStateChange]',
      'Received message from ',
      topic,
      'payload: ',
      payload
    );
    this.Z2MState = payload;
    this.emit(ZIGBEE2MQTT_EVENTS.STATE_CHANGE, payload);
    if (this.firstTime && payload.state === 'online') {
      this.firstTime = false;
      this.emit(ZIGBEE2MQTT_EVENTS.READY);
      this.subscribeToEvents();
    }
  }

  subscribeToEvents() {
    mqtt.subscribe(TOPICS.BRIDGE.DEVICES, this._handleDevicesList);
    mqtt.subscribe(TOPICS.BRIDGE.INFO, this._handleBridgeInfo);
    mqtt.subscribe(TOPICS.BRIDGE.EVENT, this._handleBridgeEvents);
  }

  async _handleDevicesList(topic, payload) {
    logger.debug('[_handleDevicesList]', 'Received message from ', topic);

    for (const device of payload) {
      let existingDevice;
      setTimeout(async () => {
        existingDevice = this.getDeviceByAddress(device.ieee_address);
        if (
          !existingDevice &&
          device.type !== 'Coordinator' &&
          device.interview_completed
        ) {
          this.devices[device.ieee_address] = await ZigbeeDevice.create(
            device,
            this
          );
          logger.debug(
            '[_handleDevicesList]',
            'Device added to driver',
            this.devices[device.ieee_address]
          );
          this.emit(
            ZIGBEE2MQTT_EVENTS.DEVICE_ADDED,
            this.devices[device.ieee_address]
          );
        }
      }, 1000);
    }
    this.emit(ZIGBEE2MQTT_EVENTS.DEVICES_LIST_UPDATE, payload);
  }

  getDeviceByAddress(ieeeAddress) {
    return this.devices[ieeeAddress];
  }

  _handleBridgeInfo(topic, payload) {
    logger.debug('[_handleBridgeInfo]', 'Received message from ', topic);
    if (payload.restart_required) {
      logger.info('Bridge requires restart');
      this.emit(ZIGBEE2MQTT_EVENTS.RESTART_REQUIRED);
      this.restart();
    }
    this.bridgeInfo = payload;
    this.emit(ZIGBEE2MQTT_EVENTS.BRIDGE_INFO, payload);
  }

  _handleBridgeEvents(topic, payload) {
    logger.debug(
      '[_handleBridgeEvents]',
      'Received message from ',
      topic,
      'payload: ',
      payload
    );
    this.emit(ZIGBEE2MQTT_EVENTS.BRIDGE_EVENT, payload);
  }

  async restart() {
    if (!this.isReady()) {
      logger.warn('Bridge is not available. Cannot send restart request.');
      return false;
    }
    return new Promise((resolve, reject) => {
      mqtt.publish(TOPICS.BRIDGE.REQUEST.RESTART, {}, resolve);
    });
  }

  isReady() {
    return this.Z2MState.state === 'online';
  }

  destroy() {
    mqtt.unsubscribe(TOPICS.BRIDGE.STATE, this._handleStateChange);
    mqtt.unsubscribe(TOPICS.BRIDGE.DEVICES, this._handleDevicesList);
    this.removeAllListeners();
  }

  getDevices() {
    return Object.values(this.devices);
  }

  async _permitJoin(time = 254) {
    if (!this.isReady()) {
      logger.warn('Bridge is not available. Cannot send permit join request.');
      return false;
    }

    const requestTopic = TOPICS.BRIDGE.REQUEST.PERMIT_JOIN;
    const responseTopic = TOPICS.BRIDGE.RESPONSE.PERMIT_JOIN;
    const payload = {
      time,
    };

    try {
      const response = await requestResponseHandler({
        requestTopic,
        payload,
        responseTopic,
      });
      if (response.status === 'ok') {
        return true;
      } else {
        throw new Error('Failed to permit join');
      }
    } catch (error) {
      logger.error('Error in permitJoin:', error);
      return false;
    }
  }

  startInclusion(time) {
    return this._permitJoin(time);
  }

  stopInclusion() {
    return this._permitJoin(0);
  }

  async removeDevice(ieeeAddress, force = false) {
    const device = this.getDeviceByAddress(ieeeAddress);
    if (device && this.isReady()) {
      const requestTopic = TOPICS.BRIDGE.REQUEST.DEVICE_REMOVE;
      const responseTopic = TOPICS.BRIDGE.RESPONSE.DEVICE_REMOVE;
      const payload = {
        id: ieeeAddress,
        force:
          device.device.power_source === 'Battery' || device.available === false
            ? true
            : force,
      };

      try {
        const response = await requestResponseHandler({
          requestTopic,
          payload,
          responseTopic,
        });
        if (response.status === 'ok') {
          logger.info('Device removed:', device.ieeeAddress);
          device.destroy();
          delete this.devices[ieeeAddress];
        } else {
          logger.error('Error in removeDevice:', response);
          if (!force) {
            logger.warn(
              'Error removing device, try again with force option',
              device.ieeeAddress
            );
            return this.removeDevice(ieeeAddress, true);
          }
        }
      } catch (error) {
        logger.error('Error in removeDevice:', error);
        return false;
      }
    } else {
      logger.warn(
        'Device not found or bridge is not ready. Cannot remove device.'
      );
      return false;
    }
  }
}
module.exports = ZigbeeDriver;
