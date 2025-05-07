const CommonCrudService = require('../services/commonCrudService');
const HTTP_CONSTANTS = require('../constants/http.constants');
const logger = require('../util/logger');
const sequelize = require('../database/sequelize');
const CustomError = require('../util/customError');

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
    const models = await modelContext.instance.findAll({});
    return res.status(HTTP_CONSTANTS.CODE.OK).json({
      message: `Fetched all ${modelContext.name}`,
      code: HTTP_CONSTANTS.CODE.OK,
      data: models,
    });
  } catch (error) {
    return res
      .status(error.httpStatus || HTTP_CONSTANTS.CODE.BAD_REQUEST)
      .json({
        message: error.message,
        code: error.code | HTTP_CONSTANTS.CUSTOM_CODE.API.ERROR_CREATING,
      });
  }
};
