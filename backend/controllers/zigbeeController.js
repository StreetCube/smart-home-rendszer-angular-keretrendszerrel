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
  });
};

exports.sendCommandToDevice = (req, res) => {
  try {
    const { property, value, ieeeAddress } = req.body;

    if (!property || !value || !ieeeAddress) {
      return res.status(httpConstants.CODE.BAD_REQUEST).json({
        message: 'Invalid data provided',
        code: httpConstants.CUSTOM_CODE.GENERAL.BAD_REQUEST,
      });
    }
    driver.getDeviceByAddress(ieeeAddress).sendCommand(property, value);
    res.status(httpConstants.CODE.OK).json({
      message: 'Command sent successfully',
      code: httpConstants.CUSTOM_CODE.ZIGBEE.COMMAND_SENT,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res
        .status(error.httpStatus || httpConstants.CODE.BAD_REQUEST)
        .json({ message: error.message, code: error.code });
    } else {
      return res.status(httpConstants.CODE.INTERNAL_SERVER_ERROR).json({
        message: 'Error including device',
        code: httpConstants.CODE.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

exports.includeDevice = async (req, res) => {
  try {
    if (!req.body.name || !req.body.RoomId) {
      throw new CustomError(
        'Invalid data provided',
        httpConstants.CUSTOM_CODE.GENERAL.BAD_REQUEST,
        httpConstants.CODE.BAD_REQUEST
      );
    }
    await ProductCrudService.checkElementForCreation({ name: req.body.name });
  } catch (error) {
    if (error instanceof CustomError) {
      return res
        .status(error.httpStatus || httpConstants.CODE.BAD_REQUEST)
        .json({ message: error.message, code: error.code });
    } else {
      return res.status(httpConstants.CODE.INTERNAL_SERVER_ERROR).json({
        message: 'Error including device',
        code: httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
      });
    }
  }
  const timeout = setTimeout(() => {
    driver.stopInclusion();
    driver.removeListener(ZIGBEE2MQTT_EVENTS.DEVICE_ADDED, onDeviceAdded);
    res.status(httpConstants.CODE.REQUEST_TIMEOUT).json({
      message: 'Device inclusion timed out',
      code: httpConstants.CUSTOM_CODE.ZIGBEE.INCLUSION_TIMEOUT,
    });
  }, 60000);
  const onDeviceAdded = async (device) => {
    clearTimeout(timeout);
    logger.info('Device added:', device.ieeeAddress);
    driver.stopInclusion();
    const t = await sequelize.transaction();
    try {
      const supportedProduct = await createSupportedProduct(device, t);
      if (supportedProduct.new) {
        await createProductCapabilites(device, supportedProduct.model, t);
      }
      await createProduct(req.body, device, supportedProduct.model, t);

      await t.commit();
      driver.removeListener(ZIGBEE2MQTT_EVENTS.DEVICE_ADDED, onDeviceAdded);
      res.status(201).json({
        message: 'Device included successfully',
        code: httpConstants.CUSTOM_CODE.ZIGBEE.DEVICE_ADDED,
      });
    } catch (error) {
      await t.rollback();
      driver.removeDevice(device.ieeeAddress, true);
      driver.stopInclusion();
      logger.error(`Error creating product: ${error.message}`);
      driver.removeListener(ZIGBEE2MQTT_EVENTS.DEVICE_ADDED, onDeviceAdded);
      if (error instanceof CustomError) {
        res
          .status(error.httpStatus || httpConstants.CODE.INTERNAL_SERVER_ERROR)
          .json({ message: error.message, code: error.code });
      } else {
        res.status(httpConstants.CODE.INTERNAL_SERVER_ERROR).json({
          message: 'Error including device',
          code: httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
        });
      }
    }
  };
  setEventOnlyOnce(driver, ZIGBEE2MQTT_EVENTS.DEVICE_ADDED, onDeviceAdded);
  driver.startInclusion();
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
    logger.error(`Error creating supported product: ${error.message}`);
    if (error instanceof CustomError) {
      throw error;
    }
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

exports.removeDevice = async (ieeeAddress) => {
  driver.removeDevice(ieeeAddress);
};

exports.getStateOfDevice = (ieeeAddress) => {
  const device = driver.getDeviceByAddress(ieeeAddress);
  if (!device) {
    logger.warn('Device not found:', ieeeAddress);
    return false;
  }
  return device.available;
};
