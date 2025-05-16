const TAG = 'CommonCrudService';
const MODEL_CONSTANTS = require('../constants/model.constants');
const HTTP_CONSTANTS = require('../constants/http.constants');
const logger = require('../util/logger');
const models = require('../database/models').models;
const UserCrudService = require('./userCrudService');
const authController = require('../auth/authController');
const CustomError = require('../util/customError');

/**
 * Checks if elements already exist in the database for a given model before creation.
 *
 * @param {string} modelName - The name of the model to check (e.g., 'User').
 * @param {Object} body - The request body containing data to check for existing elements.
 * @throws {CustomError} If elements already exist in the database.
 * @returns {Promise<boolean>} Returns `true` if no existing elements are found.
 */
exports.checkExistingElementsForCreation = async (modelName, body) => {
  logger.info(
    `[${TAG}] Checking if elements already exist for model: ${modelName}`
  );
  let findWhere = {};
  let errorCode = HTTP_CONSTANTS.CUSTOM_CODE.API.ALREADY_EXISTS;

  switch (modelName) {
    case MODEL_CONSTANTS.NAME.USER:
      logger.debug(`[${TAG}] Preparing where condition for User model`);
      findWhere = UserCrudService.createWhereOptionForCreation(body);
      errorCode = HTTP_CONSTANTS.CUSTOM_CODE.AUTH.USER_ALREADY_EXISTS;
      break;
    case MODEL_CONSTANTS.NAME.ROOM:
      logger.debug(`[${TAG}] Preparing where condition for Room model`);
      findWhere = {
        name: body.name,
        UserId: body.UserId,
      };
      break;

    default:
      break;
  }
  if (Object.keys(findWhere).length !== 0) {
    const foundItems = await models[modelName].findAll({ where: findWhere });
    if (foundItems.length > 0) {
      logger.warn(`[${TAG}] Element already exists for model: ${modelName}`);
      throw new CustomError(
        'Already exists',
        errorCode || HTTP_CONSTANTS.CUSTOM_CODE.API.ALREADY_EXISTS,
        HTTP_CONSTANTS.CODE.CONFLICT
      );
    }
  }

  logger.info(`[${TAG}] No existing elements found for model: ${modelName}`);
  return true;
};

/**
 * Checks additional parameters required for creating a specific model.
 *
 * @param {string} modelName - The name of the model to check (e.g., 'User').
 * @param {Object} body - The request body containing data to validate.
 * @throws {CustomError} If the additional parameters are invalid.
 * @returns {Promise<boolean>} Returns `true` if the additional parameters are valid.
 */
exports.CheckAdditionalCreationParams = async (modelName, body) => {
  logger.info(
    `[${TAG}] Checking additional creation parameters for model: ${modelName}`
  );
  try {
    switch (modelName) {
      case MODEL_CONSTANTS.NAME.USER:
        logger.debug(
          `[${TAG}] Validating additional parameters for User model`
        );
        return authController.checkDataForRegistration(body);
      default:
        break;
    }
    if (modelName === MODEL_CONSTANTS.NAME.USER) {
      logger.debug(`[${TAG}] Validating additional parameters for User model`);
      return authController.checkDataForRegistration(body);
    }
    return true;
  } catch (error) {
    logger.error(
      `[${TAG}] Error while checking additional parameters: ${error.message}`
    );
    throw error;
  }
};

/**
 * Executes additional tasks after creating a specific model.
 *
 * @param {string} modelName - The name of the model to process (e.g., 'User').
 * @param {Object} body - The request body containing data for the created model.
 * @param {Object} res - The response object to set cookies for user if needed.
 * @param {Object} transaction - The transaction object for database operations if needed.
 * @throws {Error} If an error occurs during the additional tasks.
 */
exports.additionalTasksAfterCreation = (modelName, body, res) => {
  logger.info(
    `[${TAG}] Executing additional tasks after creation for model: ${modelName}`
  );
  try {
    if (modelName === MODEL_CONSTANTS.NAME.USER) {
      logger.debug(`[${TAG}] Validating user after creation`);
      authController.signJwt(body, res);
    }
  } catch (error) {
    logger.error(`[${TAG}] Error during additional tasks: ${error.message}`);
    throw error;
  }
};

exports.checkExistingElementsForUpdate = async (modelName, body) => {
  try {
    logger.info(
      `[${TAG}] Checking if elements already exist for model: ${modelName}`
    );
    let findWhere = {};
    let errorCode = HTTP_CONSTANTS.CUSTOM_CODE.API.ALREADY_EXISTS;

    switch (modelName) {
      case MODEL_CONSTANTS.NAME.ROOM:
        logger.debug(`[${TAG}] Preparing where condition for Room model`);
        findWhere = {
          name: body.name,
        };
        break;
      case MODEL_CONSTANTS.NAME.PRODUCT:
        logger.debug(`[${TAG}] Preparing where condition for Product model`);
        findWhere = {
          name: body.name,
          RoomId: body.RoomId,
        };
        break;
      default:
        break;
    }
    if (Object.keys(findWhere).length !== 0) {
      const foundItems = await models[modelName].findAll({ where: findWhere });
      if (foundItems.length > 0) {
        logger.warn(`[${TAG}] Element already exists for model: ${modelName}`);
        throw new CustomError(
          'Already exists',
          errorCode || HTTP_CONSTANTS.CUSTOM_CODE.API.ALREADY_EXISTS,
          HTTP_CONSTANTS.CODE.CONFLICT
        );
      }
    }

    logger.info(`[${TAG}] No existing elements found for model: ${modelName}`);
    return true;
  } catch (error) {
    logger.error(
      `[${TAG}] Error while checking existing elements: ${error.message}`
    );
    if (error instanceof CustomError) {
      throw error;
    }
  }
};
