const zigbeeDriver = require('../driver/zigbeeDriver');
const { ZIGBEE2MQTT_EVENTS } = require('../mqtt/mqtt.constants');
const logger = require('../util/logger');
const { setEventOnlyOnce } = require('../util/utils');

const ProductPartsService = require('../services/productPartsService');
const ProductCrudService = require('../services/productCrudService');
const sequelize = require('../database/sequelize');
const httpConstants = require('../constants/http.constants');

const ZigbeeDevice = require('./zigbeeDevice');
const CustomError = require('../util/customError');

/**
 * Instance of the Zigbee driver used to interact with Zigbee2MQTT.
 *
 * @type {import('../driver/zigbeeDriver')}
 */
let driver = null;
exports.start = () => {
  driver = new zigbeeDriver();
  driver.on(ZIGBEE2MQTT_EVENTS.READY, () => {
    logger.info('Zigbee2MQTT is ready');

    driver.on(ZIGBEE2MQTT_EVENTS.DEVICES_LIST_UPDATE, async () => {
      for (const device of driver.getDevices()) {
      }
    });
  });
};

exports.includeDevice = (req, res) => {
  driver.startInclusion();
  const timeout = setTimeout(() => {
    driver.stopInclusion();
    driver.removeListener(ZIGBEE2MQTT_EVENTS.DEVICE_ADDED, onDeviceAdded);
    res.status(408).json({ message: 'Device inclusion timed out' });
  }, 60000);

  const onDeviceAdded = async (device) => {
    clearTimeout(timeout);
    logger.info('Device added:', device.ieeeAddress);
    driver.stopInclusion();
    const t = await sequelize.transaction();
    try {
      const supportedProduct = await createSupportedProduct(device, t);
      await createProductCapabilites(device, supportedProduct, t);
      await createProduct(req.body, device, supportedProduct, t);

      await t.commit();
      res.status(201).json({ message: 'Device included successfully' });
    } catch (error) {
      logger.error(`Error creating product: ${error.message}`);
      driver.removeDevice(device.ieeeAddress, true);
      await t.rollback();
      res.status(500).json({ message: 'Error including device' });
    }
    driver.removeListener(ZIGBEE2MQTT_EVENTS.DEVICE_ADDED, onDeviceAdded);
  };

  setEventOnlyOnce(driver, ZIGBEE2MQTT_EVENTS.DEVICE_ADDED, onDeviceAdded);
};

const createSupportedProduct = async (device, transaction) => {
  try {
    const supportedProduct =
      await ProductPartsService.createOrGetSupportedProduct(
        device.deviceName,
        device.type,
        transaction
      );
    return supportedProduct;
  } catch (error) {
    throw error;
  }
};

const createProductCapabilites = async (
  device,
  supportedProduct,
  transaction
) => {
  const capabilities = Object.values(device.properties);
  await ProductPartsService.createProductCapabilities(
    capabilities,
    supportedProduct,
    transaction
  );
};

const createProduct = async (body, device, supportedProduct, transaction) => {
  try {
    const product = await ProductCrudService.createProduct(
      {
        name: body.name,
        ieee_address: device.ieeeAddress,
        SupportedProductId: supportedProduct.id,
        RoomId: body.RoomId,
      },
      transaction
    );
    return product;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError(
        'Error creating product',
        httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
        httpConstants.CODE.INTERNAL_SERVER_ERROR
      );
    }
  }
};

exports.excludeDevice = (req, res) => {
  if (driver.removeDevice(req.params.ieeeAddress)) {
    res.status(200).json({ message: 'Device removed successfully' });
  } else {
    res.status(404).json({ message: 'Device not found' });
  }
};
