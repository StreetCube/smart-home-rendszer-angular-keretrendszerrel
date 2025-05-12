/**
 * Service for CRUD operations on Product entities.
 * @module services/productCrudService
 */

const models = require('../database/models').models;
const MODEL_CONSTANTS = require('../constants/model.constants');
const CustomError = require('../util/customError');
const logger = require('../util/logger');
const httpConstants = require('../constants/http.constants');
const { Op } = require('sequelize');

/**
 * Fetches a product by its IEEE address.
 * @async
 * @param {string} ieeeAddress - The IEEE address of the product.
 * @param {object} [transaction] - Optional Sequelize transaction.
 * @returns {Promise<object|null>} The product if found, otherwise null.
 */
exports.getProductByIeeeAddress = async (ieeeAddress, transaction) => {
  try {
    const product = await models[MODEL_CONSTANTS.NAME.PRODUCT].findOne({
      where: { ieeeAddress },
      transaction,
    });
    return product;
  } catch (error) {
    logger.error(
      `Error fetching product by ieeeAddress: ${ieeeAddress}, error: ${error.message}`
    );
  }
};

/**
 * Validates product data.
 * @async
 * @param {object} body - The product data.
 * @throws {CustomError} If data is invalid.
 */
checkDataValidity = async (body) => {
  if (!body.name || !body.RoomId) {
    throw new CustomError(
      'Invalid data provided',
      httpConstants.CUSTOM_CODE.GENERAL.BAD_REQUEST,
      httpConstants.CODE.BAD_REQUEST
    );
  }
};

/**
 * Checks if a product with the given name or IEEE address already exists.
 * @async
 * @param {object} param0 - Object containing name and ieee_address.
 * @param {object} [transaction] - Optional Sequelize transaction.
 * @throws {CustomError} If product already exists or on error.
 */
const checkElementForCreation = async ({ name, ieee_address }, transaction) => {
  try {
    const product = await models[MODEL_CONSTANTS.NAME.PRODUCT].findOne({
      where: {
        [Op.or]: [{ name }, { ieee_address }],
      },
      transaction,
    });
    if (product) {
      throw new CustomError(
        'Product already exists',
        httpConstants.CUSTOM_CODE.API.ALREADY_EXISTS,
        httpConstants.CODE.CONFLICT
      );
    }
  } catch (error) {
    logger.error(`Error checking product existence: ${error.message}`);
    throw new CustomError(
      'Error checking product existence',
      httpConstants.CUSTOM_CODE.GENERAL.OTHER,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Creates a new product.
 * @async
 * @param {object} body - The product data.
 * @param {object} [transaction] - Optional Sequelize transaction.
 * @returns {Promise<object>} The created product.
 * @throws {CustomError} If creation fails or data is invalid.
 */
exports.createProduct = async (body, transaction) => {
  try {
    await checkDataValidity(body);
    await checkElementForCreation(body, transaction);
    const product = await models[MODEL_CONSTANTS.NAME.PRODUCT].create(
      {
        name: body.name,
        ieeeAddress: body.ieee_address,
        SupportedProductId: body.SupportedProductId,
        RoomId: body.RoomId,
      },
      { transaction }
    );
    return product;
  } catch (error) {
    logger.error(`Error creating product: ${error.message}`);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(
      'Error creating product',
      httpConstants.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

exports.removeProduct = async (ieeeAddress, transaction) => {
  try {
    const product = await models[MODEL_CONSTANTS.NAME.PRODUCT].findOne({
      where: { ieeeAddress: ieeeAddress },
      transaction,
    });
    if (!product) {
      throw new CustomError(
        'Product not found',
        httpConstants.CUSTOM_CODE.API.ERROR_GETTING_RESOURCE,
        httpConstants.CODE.NOT_FOUND
      );
    }
    await product.destroy();
    return product;
  } catch (error) {
    logger.error(`Error removing product: ${error.message}`);
    throw new CustomError(
      'Error removing product',
      httpConstants.CUSTOM_CODE.API.ERROR_DELETING_RESOURCE,
      httpConstants.CODE.INTERNAL_SERVER_ERROR
    );
  }
};
