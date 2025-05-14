const { Op } = require('sequelize');
const MODEL_CONSTANTS = require('../constants/model.constants');
const logger = require('../util/logger');
const models = require('../database/models').models;
const sequelize = require('../database/sequelize');

exports.createDeviceStateForProduct = async (ieeeAddress, deviceStateData) => {
  try {
    const product = await getProductWithCapabilities(ieeeAddress);

    const latestStates = await getLatestDeviceStates(product);

    const currentStates = await getCurrentDeviceStates(latestStates);

    const statesToCreate = generateDeviceStatesToCreate(
      product,
      currentStates,
      deviceStateData
    );

    await createDeviceStates(statesToCreate);

    logger.info('Device states processed successfully');
  } catch (error) {
    logger.error('Error processing device states:', error);
  }
};

// 1. Fetch product with capabilities
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

// 2. Get latest timestamps per capability
const getLatestDeviceStates = async (product, capabilityIds) => {
  if (!capabilityIds) {
    capabilityIds = product.SupportedProduct.ProductCapabilities.map(
      (pc) => pc.id
    );
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

// 3. Get current device states
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

// 4. Generate device state creation DTOs
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

// Helper: Determine value type from capability
function getValueType(capability) {
  return capability.EnumExposeId
    ? 'textValue'
    : capability.NumericExposeId
    ? 'numericValue'
    : 'boolValue';
}

// Helper: Create state data transfer object
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

// 5. Bulk create device states
async function createDeviceStates(statesToCreate) {
  if (statesToCreate.length === 0) {
    logger.info('No new device states to create');
    return;
  }

  return models[MODEL_CONSTANTS.NAME.DEVICE_STATE].bulkCreate(statesToCreate, {
    ignoreDuplicates: true,
  });
}
