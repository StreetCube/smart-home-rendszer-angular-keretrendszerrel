const models = require('../database/models').models;
const MODEL_CONSTANTS = require('../constants/model.constants');
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
      return exists;
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
    return newProduct;
  } catch (error) {
    logger.error(`Error creating supported product: ${error.message}`);
    throw error;
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
  for (const capabilitiy of capabilities) {
    let binaryId = null;
    let numericId = null;
    let stringId = null;
    switch (capabilitiy.type) {
      case 'binary':
        const binary = await models[MODEL_CONSTANTS.NAME.BINARY_EXPOSE].create(
          {
            value_on: capabilitiy.value_on,
            value_off: capabilitiy.value_off,
            value_toggle: capabilitiy.value_toggle,
          },
          { transaction }
        );
        binaryId = binary.id;
        break;
      case 'numeric':
        const numeric = await models[
          MODEL_CONSTANTS.NAME.NUMERIC_EXPOSE
        ].create(
          {
            value_min: capabilitiy.value_min,
            value_max: capabilitiy.value_max,
            value_step: capabilitiy.value_step,
            unit: capabilitiy.unit,
          },
          { transaction }
        );
        numericId = numeric.id;
        break;
      case 'enum':
        const enumValue = await models[MODEL_CONSTANTS.NAME.ENUM_EXPOSE].create(
          {
            values: capabilitiy.values,
          },
          { transaction }
        );
        stringId = enumValue.id;
        break;

      default:
        logger.warn(`Unsupported capability type: ${capabilitiy.type}`);
        break;
    }
    const capability = await models[
      MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY
    ].create(
      {
        ...capabilitiy,
        BinaryExposeId: binaryId,
        NumericExposeId: numericId,
        EnumExposeId: stringId,
        SupportedProductId: supportedProduct.id,
      },
      { transaction }
    );
  }
};
