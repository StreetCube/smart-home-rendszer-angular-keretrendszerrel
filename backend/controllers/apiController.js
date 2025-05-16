const CommonCrudService = require('../services/commonCrudService');
const HTTP_CONSTANTS = require('../constants/http.constants');
const logger = require('../util/logger');
const sequelize = require('../database/sequelize');
const MODEL_CONSTANTS = require('../constants/model.constants');
const models = require('../database/models').models;
const CustomError = require('../util/customError');
const zigbeeController = require('./zigbeeController');

exports.createPreparation = async (req, res) => {
  const { body, modelContext } = req;
  try {
    // prettier-ignore
    if (
        await CommonCrudService.checkExistingElementsForCreation(modelContext.name, body) &&
        await CommonCrudService.CheckAdditionalCreationParams(modelContext.name, body)
      ) {
        const createdModel = await createModel(modelContext,body, res);
        return res.status(HTTP_CONSTANTS.CODE.CREATED).json({message: `Created ${modelContext.name}`, code: HTTP_CONSTANTS.CODE.CREATED, data: createdModel.dataValues});
      }
  } catch (error) {
    return res
      .status(error.httpStatus || 400)
      .json({ message: error.message, code: error.code });
  }
};

const createModel = async (modelContext, body, res) => {
  const t = await sequelize.transaction();
  try {
    const model = await modelContext.instance.create(body, { transaction: t });
    CommonCrudService.additionalTasksAfterCreation(
      modelContext.name,
      body,
      res
    );
    await t.commit();
    return model;
  } catch (error) {
    await t.rollback();
    throw new CustomError(
      `Error creating ${modelName}: ${error.message}`,
      HTTP_CONSTANTS.CUSTOM_CODE.GENERAL.OTHER,
      HTTP_CONSTANTS.CODE.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getAll = async (req, res) => {
  const { modelContext } = req;
  try {
    const hasWithUserScope =
      modelContext.instance.options.scopes &&
      modelContext.instance.options.scopes.withUser;

    let models;
    if (hasWithUserScope) {
      models = await modelContext.instance
        .scope({ method: ['withUser', req.user.id] })
        .findAll({});
    } else {
      models = await modelContext.instance.findAll({});
    }
    return res.status(HTTP_CONSTANTS.CODE.OK).json({
      message: `Fetched all ${modelContext.name}`,
      code: HTTP_CONSTANTS.CODE.OK,
      data: models,
    });
  } catch (error) {
    logger.error(`Error fetching all ${modelContext.name}: ${error.message}`);
    return res
      .status(error.httpStatus || HTTP_CONSTANTS.CODE.BAD_REQUEST)
      .json({
        message: error.message,
        code: error.code | HTTP_CONSTANTS.CUSTOM_CODE.API.ERROR_CREATING,
      });
  }
};

exports.updateModel = async (req, res) => {
  const { modelContext, body } = req;
  try {
    const model = await modelContext.instance.findByPk(body.id);
    if (!model) {
      return res.status(HTTP_CONSTANTS.CODE.NOT_FOUND).json({
        message: 'Model not found',
        code: HTTP_CONSTANTS.CUSTOM_CODE.API.ERROR_GETTING_RESOURCE,
      });
    }
    await CommonCrudService.checkExistingElementsForUpdate(
      modelContext.name,
      body
    );
    await model.update(body);
    return res.status(HTTP_CONSTANTS.CODE.OK).json({
      message: `Updated ${modelContext.name}`,
      code: HTTP_CONSTANTS.CODE.OK,
      data: model,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res
        .status(error.httpStatus || HTTP_CONSTANTS.CODE.BAD_REQUEST)
        .json({ message: error.message, code: error.code });
    }
    logger.error(`Error updating ${modelContext.name}: ${error.message}`);
    return res.status(HTTP_CONSTANTS.CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      code: error.code | HTTP_CONSTANTS.CUSTOM_CODE.API.ERROR_CREATING_RESOURCE,
    });
  }
};

exports.deleteModel = async (req, res) => {
  const { modelContext, params } = req;
  const transaction = await sequelize.transaction();
  try {
    const model = await modelContext.instance.findByPk(params.id);
    if (!model) {
      return res.status(HTTP_CONSTANTS.CODE.NOT_FOUND).json({
        message: 'Model not found',
        code: HTTP_CONSTANTS.CUSTOM_CODE.API.ERROR_GETTING_RESOURCE,
      });
    }
    await model.destroy({ transaction });
    await postDeleteModel(modelContext, model, transaction);
    await transaction.commit();
    return res.status(HTTP_CONSTANTS.CODE.OK).json({
      message: `Deleted ${modelContext.name}`,
      code: HTTP_CONSTANTS.CODE.OK,
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deleting ${modelContext.name}: ${error.message}`);
    return res.status(HTTP_CONSTANTS.CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      code: error.code | HTTP_CONSTANTS.CUSTOM_CODE.API.ERROR_DELETING_RESOURCE,
    });
  }
};

const postDeleteModel = async (modelContext, modelToBeDeleted, transaction) => {
  try {
    switch (modelContext.name) {
      case MODEL_CONSTANTS.NAME.PRODUCT:
        zigbeeController.removeDevice(modelToBeDeleted.ieeeAddress);
        return;
      case MODEL_CONSTANTS.NAME.ROOM:
        const products = await models[MODEL_CONSTANTS.NAME.PRODUCT].findAll({
          where: {
            RoomId: modelToBeDeleted.id,
          },
        });
        for (const product of products) {
          await zigbeeController.removeDevice(product.ieeeAddress);
          await product.destroy({ transaction });
        }
      default:
        break;
    }
  } catch (error) {
    logger.error(
      `Error in postDeleteModel for ${modelContext.name}: ${error.message}`
    );
    throw new CustomError(
      `Error in postDeleteModel for ${modelContext.name}: ${error.message}`,
      HTTP_CONSTANTS.CUSTOM_CODE.API.ERROR_DELETING_RESOURCE,
      HTTP_CONSTANTS.CODE.INTERNAL_SERVER_ERROR
    );
  }
};
