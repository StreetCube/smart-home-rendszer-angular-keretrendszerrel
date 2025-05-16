const { EventEmitter } = require('events');
const { TOPICS } = require('../mqtt/mqtt.constants');
const { ZIGBEE2MQTT_EVENTS } = require('../mqtt/mqtt.constants');
const mqtt = require('./mqttController').subscriptionManager;
const logger = require('../util/logger');
const { getZigbeeDeviceProperties } = require('../util/utils');
const productCrudService = require('../services/productCrudService');
const deviceStateCrudService = require('../services/deviceStateCrudService');
const { ACCESS } = require('../constants/zigbee2mqtt.constants');
/**
 * @typedef {import('zigbee2mqtt/dist/types/api').Zigbee2MQTTDevice} Zigbee2MQTTDevice
 *
 */
class ZigbeeDevice extends EventEmitter {
  /**
   * @param {Zigbee2MQTTDevice} device
   * @param {import('../driver/zigbeeDriver')} driver
   */
  constructor(device, driver) {
    super();
    /**
     * @type {Zigbee2MQTTDevice}
     */
    this.device = device;
    /**
     * @type {import('../driver/zigbeeDriver')}
     */
    this.driver = driver;
    this.available = false;
    this.ieeeAddress = device.ieee_address;

    this.properties = device.definition
      ? getZigbeeDeviceProperties(device.definition.exposes)
      : {};

    this.options = device.definition
      ? getZigbeeDeviceProperties(device.definition.options)
      : {};

    this.deviceName = `${this.device.definition.vendor} - ${this.device.definition.model}`;
    this.type = this._determineDeviceType();

    this._handleAvailabilityChange = this._handleAvailabilityChange.bind(this);
    this._handleStateChange = this._handleStateChange.bind(this);

    this.productModel = this.getProductModel();

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    mqtt.subscribe(
      TOPICS.DEVICE.AVAILABILITY(this.ieeeAddress),
      this._handleAvailabilityChange
    );
    mqtt.subscribe(
      TOPICS.DEVICE.STATE(this.ieeeAddress),
      this._handleStateChange
    );
  }

  static async create(device, driver, productModel) {
    const zigbeeDevice = new ZigbeeDevice(device, driver);
    zigbeeDevice.productModel = productModel;
    if (!productModel) {
      zigbeeDevice.productModel = await zigbeeDevice.getProductModel();
    } else {
    }
    return zigbeeDevice;
  }

  async getProductModel() {
    if (!this.productModel) {
      this.productModel = await productCrudService.getProductByIeeeAddress(
        this.ieeeAddress
      );
    }
    return this.productModel;
  }

  _determineDeviceType() {
    for (const property of Object.values(this.properties)) {
      if (property.specificType) {
        logger.debug(
          '[_determineDeviceType]',
          'Device type determined as',
          property.specificType
        );
        return property.specificType;
      }
    }
  }

  destroy() {
    mqtt.unsubscribe(TOPICS.DEVICE.AVAILABILITY(this.ieeeAddress));
    mqtt.unsubscribe(TOPICS.DEVICE.STATE(this.ieeeAddress));
    this.removeAllListeners();
  }

  _handleAvailabilityChange(topic, payload) {
    logger.debug(
      '[_handleAvailabilityChange]',
      'Received message from ',
      topic,
      'payload: ',
      payload
    );
    this.available = payload.state === 'online';
    this.emit(ZIGBEE2MQTT_EVENTS.AVAILABILITY_CHANGE, payload);
  }

  _handleStateChange(topic, payload) {
    logger.debug(
      '[_handleStateChange]',
      'Received message from ',
      topic,
      'payload: ',
      payload
    );
    this.state = { ...this.state, ...payload };
    deviceStateCrudService.createDeviceStateForProduct(
      this.ieeeAddress,
      payload
    );
    this.emit(ZIGBEE2MQTT_EVENTS.DEVICE_STATE_CHANGE, payload);
  }

  sendCommand(property, value) {
    return new Promise((resolve, reject) => {
      if (!this.driver.isReady()) {
        logger.warn('Bridge is not available. Cannot send command.');
        reject(new Error('Bridge is not available'));
        return;
      }

      if (this.options[property]) {
        logger.warn('Option setting is not supported yet');
        reject(new Error('Option setting is not supported yet'));
      }

      if (this.properties[property].access & ACCESS.SET) {
        mqtt.publish(TOPICS.DEVICE.SET(this.ieeeAddress), {
          [property]: value,
        });
        resolve(true);
      } else {
        logger.warn('Property is not settable');
        reject(new Error('Property is not settable'));
      }
    });
  }
}

module.exports = ZigbeeDevice;
