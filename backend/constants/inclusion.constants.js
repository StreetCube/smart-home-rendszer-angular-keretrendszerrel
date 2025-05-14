const models = require('../database/models').models;
const MODEL_CONSTANTS = require('../constants/model.constants');

exports.INCLUSION_CONSTANTS = Object.freeze({
  Product: {
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
  },
});
