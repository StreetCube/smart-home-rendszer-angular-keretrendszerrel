const { Op } = require('sequelize');
const MODEL_CONSTANTS = require('../constants/model.constants');
const logger = require('../util/logger');
const models = require('../database/models').models;
const sequelize = require('../database/sequelize');

/**
 * Creates device state entries for a product based on its capabilities and new state data.
 * Only creates new states if the value has changed.
 *
 * @async
 * @param {string} ieeeAddress - The IEEE address of the product.
 * @param {Object} deviceStateData - Key-value pairs of capability property names and their new values.
 * @returns {Promise<void>}
 */
exports.createDeviceStateForProduct = async (ieeeAddress, deviceStateData) => {
  try {
    const product = await getProductWithCapabilities(ieeeAddress);
    if (!product) {
      logger.warn(`Product with IEEE address ${ieeeAddress} not found`);
      return;
    }

    const latestStates = await getLatestDeviceStates(product);
    if (!latestStates) {
      logger.warn(`No latest device states found for product ${ieeeAddress}`);
      return;
    }

    const currentStates = await getCurrentDeviceStates(latestStates);
    if (!currentStates) {
      logger.warn(`No current device states found for product ${ieeeAddress}`);
      return;
    }

    const statesToCreate = generateDeviceStatesToCreate(
      product,
      currentStates,
      deviceStateData
    );
    if (statesToCreate && statesToCreate.length === 0) {
      logger.info('No changes detected in device states');
      return;
    }

    await createDeviceStates(statesToCreate);

    logger.info('Device states processed successfully');
  } catch (error) {
    logger.error('Error processing device states:', error);
  }
};

/**
 * Fetches a product by IEEE address, including its supported product and capabilities.
 * @async
 * @param {string} ieeeAddress - The IEEE address of the product.
 * @returns {Promise<Object>} The product with included supported product and capabilities.
 */
async function getProductWithCapabilities(ieeeAddress) {
  return models[MODEL_CONSTANTS.NAME.PRODUCT].findOne({
    where: { ieeeAddress },
    include: [
      {
        model: models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT],
        include: [
          {
            model: models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY],
          },
        ],
      },
    ],
  });
}

/**
 * Gets the latest device state timestamps for each capability of a product.
 * @async
 * @param {Object} product - The product object.
 * @param {Array<string>} [capabilityIds] - Optional array of capability IDs.
 * @returns {Promise<Array<{ProductCapabilityId: string, latest_at: string}>>}
 */
const getLatestDeviceStates = async (product, capabilityIds) => {
  if (!capabilityIds) {
    if (product) {
      capabilityIds = product.SupportedProduct.ProductCapabilities.map(
        (pc) => pc.id
      );
    } else {
      return;
    }
  }

  return models[MODEL_CONSTANTS.NAME.DEVICE_STATE].findAll({
    attributes: [
      'ProductCapabilityId',
      [sequelize.fn('MAX', sequelize.col('created_at')), 'latest_at'],
    ],
    where: { ProductCapabilityId: capabilityIds },
    group: ['ProductCapabilityId'],
    raw: true,
  });
};

exports.getLatestDeviceStates = getLatestDeviceStates;

/**
 * Gets the current (latest) device state rows for each capability.
 * @async
 * @param {Array<Object>} latestStates - Array of objects with ProductCapabilityId and latest_at.
 * @returns {Promise<Array<Object>>} Array of device state rows.
 */
async function getCurrentDeviceStates(latestStates) {
  return models[MODEL_CONSTANTS.NAME.DEVICE_STATE].findAll({
    where: {
      [Op.or]: latestStates.map((state) => ({
        ProductCapabilityId: state.ProductCapabilityId,
        created_at: state.latest_at,
      })),
    },
    raw: true,
  });
}

/**
 * Generates an array of device state DTOs to create, only for changed values.
 * @param {Object} product - The product object.
 * @param {Array<Object>} currentStates - Array of current device state rows.
 * @param {Object} deviceStateData - Key-value pairs of capability property names and their new values.
 * @returns {Array<Object>} Array of device state DTOs to create.
 */
function generateDeviceStatesToCreate(product, currentStates, deviceStateData) {
  return Object.keys(deviceStateData)
    .map((property) => {
      const capability = product.SupportedProduct.ProductCapabilities.find(
        (pc) => pc.property === property
      );

      if (!capability) return null;

      const currentState = currentStates.find(
        (ds) => ds.ProductCapabilityId === capability.id
      );

      const valueType = getValueType(capability);
      const newValue = deviceStateData[property];

      if (currentState?.[valueType] === newValue) return null;

      return createStateDTO(capability, product.id, valueType, newValue);
    })
    .filter(Boolean);
}

/**
 * Determines the value type key for a capability.
 * @param {Object} capability - The capability object.
 * @returns {string} The value type key ('textValue', 'numericValue', or 'boolValue').
 */
function getValueType(capability) {
  return capability.EnumExposeId
    ? 'textValue'
    : capability.NumericExposeId
    ? 'numericValue'
    : 'boolValue';
}

/**
 * Creates a device state DTO for insertion.
 * @param {Object} capability - The capability object.
 * @param {string} productId - The product ID.
 * @param {string} valueType - The value type key.
 * @param {*} value - The value to set.
 * @returns {Object} The device state DTO.
 */
function createStateDTO(capability, productId, valueType, value) {
  return {
    ProductCapabilityId: capability.id,
    ProductId: productId,
    [valueType]: value,
    ...(valueType !== 'textValue' && { textValue: null }),
    ...(valueType !== 'numericValue' && { numericValue: null }),
    ...(valueType !== 'boolValue' && { boolValue: null }),
  };
}

/**
 * Bulk creates device state entries.
 * @async
 * @param {Array<Object>} statesToCreate - Array of device state DTOs to create.
 * @returns {Promise<void>}
 */
async function createDeviceStates(statesToCreate) {
  if (statesToCreate.length === 0) {
    logger.info('No new device states to create');
    return;
  }

  return models[MODEL_CONSTANTS.NAME.DEVICE_STATE].bulkCreate(statesToCreate, {
    ignoreDuplicates: true,
  });
}
