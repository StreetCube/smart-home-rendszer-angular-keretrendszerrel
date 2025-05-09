const MODEL_CONSTANTS = require('../../constants/model.constants');

exports.associateModels = (models) => {
  // Supported_Command
  models[MODEL_CONSTANTS.NAME.SUPPORTED_COMMAND].belongsTo(
    models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT]
  );
  models[MODEL_CONSTANTS.NAME.SUPPORTED_COMMAND].belongsTo(
    models[MODEL_CONSTANTS.NAME.PRODUCT_COMMAND]
  );

  models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT].hasMany(
    models[MODEL_CONSTANTS.NAME.SUPPORTED_COMMAND]
  );
  models[MODEL_CONSTANTS.NAME.PRODUCT_COMMAND].hasMany(
    models[MODEL_CONSTANTS.NAME.SUPPORTED_COMMAND]
  );

  models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT].belongsToMany(
    models[MODEL_CONSTANTS.NAME.PRODUCT_COMMAND],
    {
      through: {
        model: models[MODEL_CONSTANTS.NAME.SUPPORTED_COMMAND],
      },
    }
  );

  models[MODEL_CONSTANTS.NAME.PRODUCT_COMMAND].belongsToMany(
    models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT],
    {
      through: {
        model: models[MODEL_CONSTANTS.NAME.SUPPORTED_COMMAND],
      },
    }
  );

  //Product
  models[MODEL_CONSTANTS.NAME.PRODUCT].belongsTo(
    models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT]
  );
  models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT].hasMany(
    models[MODEL_CONSTANTS.NAME.PRODUCT]
  );

  models[MODEL_CONSTANTS.NAME.ROOM].hasMany(
    models[MODEL_CONSTANTS.NAME.PRODUCT]
  );
  models[MODEL_CONSTANTS.NAME.PRODUCT].belongsTo(
    models[MODEL_CONSTANTS.NAME.ROOM]
  );

  models[MODEL_CONSTANTS.NAME.PRODUCT].hasMany(
    models[MODEL_CONSTANTS.NAME.SENSOR_VALUE]
  );
  models[MODEL_CONSTANTS.NAME.SENSOR_VALUE].belongsTo(
    models[MODEL_CONSTANTS.NAME.PRODUCT]
  );

  // User
  models[MODEL_CONSTANTS.NAME.USER].hasMany(models[MODEL_CONSTANTS.NAME.ROOM]);
  models[MODEL_CONSTANTS.NAME.ROOM].belongsTo(
    models[MODEL_CONSTANTS.NAME.USER]
  );

  // Sensor Value
  models[MODEL_CONSTANTS.NAME.SENSOR_TYPE].hasMany(
    models[MODEL_CONSTANTS.NAME.SENSOR_VALUE]
  );
  models[MODEL_CONSTANTS.NAME.SENSOR_VALUE].belongsTo(
    models[MODEL_CONSTANTS.NAME.SENSOR_TYPE]
  );
};
