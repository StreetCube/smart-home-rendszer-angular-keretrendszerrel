const HttpConstants = require('../constants/http.constants');
const models = require('../database/models').models;

const validateModel = (req, res, next) => {
  const { modelName } = req.params;
  if (!modelName) {
    return res.status(400).json({
      message: 'Model parameter is required',
      code: HttpConstants.CUSTOM_CODE.GENERAL.BAD_REQUEST,
    });
  }
  if (!models[modelName]) {
    return res.status(404).json({
      message: `Model ${modelName} not found`,
      code: HttpConstants.CODE.NOT_FOUND,
    });
  }

  req.modelContext = {
    name: modelName,
    instance: models[modelName],
  };
  next();
};

module.exports = validateModel;
