const models = require('../database/models').models;
const MODEL_CONSTANTS = require('../constants/model.constants');
const CustomError = require('../util/customError');
const httpConstants = require('../constants/http.constants');
const logger = require('../util/logger');

/**
 * Creates a supported product if it does not exist, or returns the existing one.
 * @async
 * @param {string} name - The name of the supported product.
 * @param {string} type - The type of the supported product.
 * @param {object} [transaction] - Optional Sequelize transaction.
 * @returns {Promise<import('../database/models').SupportedProduct>} The created or found SupportedProduct instance.
 * @throws {Error} If creation fails.
 */
exports.createOrGetSupportedProduct = async (name, type, transaction) => {
  try {
    const exists = await models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT].findOne(
      {
        where: {
          name,
        },
        transaction,
      }
    );
    if (exists) {
      logger.warn(`Supported product already exists with name: ${name}`);
      return { model: exists, new: false };
    }
    const newProduct = await models[
      MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT
    ].create(
      {
        name,
        product_type: type,
      },
      { transaction }
    );
    return { model: newProduct, new: true };
  } catch (error) {
    logger.error(`Error creating supported product: ${error.message}`);
    throw new CustomError(
      'Error creating or getting supported product',
      httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Creates product capabilities and their related expose records for a supported product.
 * @async
 * @param {Array<object>} capabilities - Array of capability objects to create.
 * @param {import('../database/models').SupportedProduct} supportedProduct - The supported product instance.
 * @param {object} [transaction] - Optional Sequelize transaction.
 * @returns {Promise<void>}
 * @throws {Error} If creation fails.
 */
exports.createProductCapabilities = async (
  capabilities,
  supportedProduct,
  transaction
) => {
  try {
    for (const capability of capabilities) {
      const { binaryId, numericId, stringId } = await createExposeByType(
        capability,
        transaction
      );
      await createProductCapabilityRecord(
        capability,
        supportedProduct.id,
        { binaryId, numericId, stringId },
        transaction
      );
    }
  } catch (error) {
    logger.error('Error creating product capabilities:', error);
    throw new CustomError(
      'Error creating product capabilities',
      httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const createBinaryExpose = async (capability, transaction) => {
  try {
    const binary = await models[MODEL_CONSTANTS.NAME.BINARY_EXPOSE].create(
      {
        value_on: capability.value_on,
        value_off: capability.value_off,
        value_toggle: capability.value_toggle,
      },
      { transaction }
    );

    return { binaryId: binary.id };
  } catch (error) {
    logger.error('Failed to create binary expose:', error);
    throw new CustomError(
      'Binary expose creation failed',
      httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const createNumericExpose = async (capability, transaction) => {
  try {
    const numeric = await models[MODEL_CONSTANTS.NAME.NUMERIC_EXPOSE].create(
      {
        value_min: capability.value_min,
        value_max: capability.value_max,
        value_step: capability.value_step,
        unit: capability.unit,
      },
      { transaction }
    );

    return { numericId: numeric.id };
  } catch (error) {
    logger.error('Failed to create numeric expose:', error);
    throw new CustomError(
      'Numeric expose creation failed',
      httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const createEnumExpose = async (capability, transaction) => {
  try {
    const enumValue = await models[MODEL_CONSTANTS.NAME.ENUM_EXPOSE].create(
      {
        values: capability.values,
      },
      { transaction }
    );

    return { stringId: enumValue.id };
  } catch (error) {
    logger.error('Failed to create enum expose:', error);
    throw new CustomError(
      'Enum expose creation failed',
      httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const createProductCapabilityRecord = async (
  capability,
  supportedProductId,
  { binaryId, numericId, stringId },
  transaction
) => {
  try {
    await models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY].create(
      {
        type: capability.type,
        name: capability.name,
        label: capability.label,
        property: capability.property,
        access: capability.access,
        description: capability.description,
        BinaryExposeId: binaryId,
        NumericExposeId: numericId,
        EnumExposeId: stringId,
        SupportedProductId: supportedProductId,
      },
      { transaction }
    );
  } catch (error) {
    logger.error('Failed to create product capability record:', error);
    throw new CustomError(
      'Product capability record creation failed',
      httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const createExposeByType = async (capability, transaction) => {
  switch (capability.type) {
    case 'binary':
      return createBinaryExpose(capability, transaction);
    case 'numeric':
      return createNumericExpose(capability, transaction);
    case 'enum':
      return createEnumExpose(capability, transaction);
    default:
      logger.warn(`Unsupported capability type: ${capability.type}`);
      return { binaryId: null, numericId: null, stringId: null };
  }
};
