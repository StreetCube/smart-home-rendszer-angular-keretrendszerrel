/**
 * Service for CRUD operations on Product entities.
 * @module services/productCrudService
 */

const models = require('../database/models').models;
const MODEL_CONSTANTS = require('../constants/model.constants');
const CustomError = require('../util/customError');
const logger = require('../util/logger');
const httpConstants = require('../constants/http.constants');
const deviceStateCrudService = require('./deviceStateCrudService');
const sequelize = require('../database/sequelize');
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
const checkDataValidity = async (body) => {
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
exports.checkElementForCreation = async ({ name }, transaction) => {
  try {
    const product = await models[MODEL_CONSTANTS.NAME.PRODUCT].findOne({
      where: {
        name,
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
    logger.error(`Error checking product existence: ${error}`);
    if (error instanceof CustomError) {
      throw error;
    }
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

exports.getProductsForRoom = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    if (!roomId) {
      throw new CustomError(
        'Room ID is required',
        httpConstants.CUSTOM_CODE.GENERAL.BAD_REQUEST,
        httpConstants.CODE.BAD_REQUEST
      );
    }

    // 1. First get products with capabilities (no device states)
    const products = await models[MODEL_CONSTANTS.NAME.PRODUCT].findAll({
      where: {
        RoomId: roomId,
      },
      attributes: ['state', 'ieeeAddress', 'name'],
      include: [
        {
          model: models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT],
          attributes: ['name', 'product_type'],
          include: [
            {
              model: models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY],
              attributes: [
                'id',
                'name',
                'type',
                'access',
                'label',
                'property',
                'description',
              ],
              include: [
                models[MODEL_CONSTANTS.NAME.BINARY_EXPOSE],
                models[MODEL_CONSTANTS.NAME.ENUM_EXPOSE],
                models[MODEL_CONSTANTS.NAME.NUMERIC_EXPOSE],
              ],
            },
          ],
        },
      ],
    });

    // 2. Get latest device states for all product capabilities

    // 3. Map latest states to products
    const productsWithLatestStates = await Promise.all(
      products.map(async (product) => {
        const productJson = product.get({ plain: true });

        const capabilityIds =
          productJson.SupportedProduct.ProductCapabilities.map((pc) => pc.id);
        const latestDeviceStateCreatedAt =
          await deviceStateCrudService.getLatestDeviceStates(
            productJson,
            capabilityIds
          );

        const states = await models[MODEL_CONSTANTS.NAME.DEVICE_STATE].findAll({
          attributes: [
            'boolValue',
            'numericValue',
            'textValue',
            'ProductCapabilityId',
          ],
          where: {
            [Op.or]: latestDeviceStateCreatedAt.map((cond) => ({
              ProductCapabilityId: cond.ProductCapabilityId,
              createdAt: cond.latest_at,
            })),
          },
          order: [['created_at', 'DESC']],
        });

        const capabilitiesWithState =
          productJson.SupportedProduct.ProductCapabilities.map((cap) => ({
            ...cap,
            deviceState:
              states.find((state) => state.ProductCapabilityId === cap.id) ||
              null,
          }));

        return {
          ...productJson,
          SupportedProduct: {
            ...productJson.SupportedProduct,
            ProductCapabilities: capabilitiesWithState,
          },
        };
      })
    );

    res.status(httpConstants.CODE.OK).json({
      message: 'Products fetched successfully',
      code: httpConstants.CODE.OK,
      data:
        Array.isArray(productsWithLatestStates) && products.length === 0
          ? null
          : productsWithLatestStates,
    });
  } catch (error) {
    logger.error(`Error fetching products for room: ${error.message}`);
    if (error instanceof CustomError) {
      return res.status(error.code).json({
        message: error.message,
        code: error.customCode,
      });
    }
    return res.status(httpConstants.CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching products for room',
      code: httpConstants.CUSTOM_CODE.API.ERROR_GETTING_RESOURCE,
    });
  }
};
