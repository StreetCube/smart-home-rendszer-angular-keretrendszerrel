const MODEL_CONSTANTS = require('../../constants/model.constants');

exports.associateModels = (models) => {
  // Product <---* SupportedProduct (One SupportedProduct hasMany Products, Product belongsTo SupportedProduct)
  models[MODEL_CONSTANTS.NAME.PRODUCT].belongsTo(
    models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT]
  );
  models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT].hasMany(
    models[MODEL_CONSTANTS.NAME.PRODUCT]
  );

  // Product *---> DeviceState (One Product hasMany DeviceStates, DeviceState belongsTo Product)
  models[MODEL_CONSTANTS.NAME.DEVICE_STATE].belongsTo(
    models[MODEL_CONSTANTS.NAME.PRODUCT]
  );
  models[MODEL_CONSTANTS.NAME.PRODUCT].hasMany(
    models[MODEL_CONSTANTS.NAME.DEVICE_STATE]
  );

  // Room <---* Product (One Room hasMany Products, Product belongsTo Room)
  models[MODEL_CONSTANTS.NAME.ROOM].hasMany(
    models[MODEL_CONSTANTS.NAME.PRODUCT]
  );
  models[MODEL_CONSTANTS.NAME.PRODUCT].belongsTo(
    models[MODEL_CONSTANTS.NAME.ROOM]
  );

  // User <---* Room (One User hasMany Rooms, Room belongsTo User)
  models[MODEL_CONSTANTS.NAME.USER].hasMany(models[MODEL_CONSTANTS.NAME.ROOM]);
  models[MODEL_CONSTANTS.NAME.ROOM].belongsTo(
    models[MODEL_CONSTANTS.NAME.USER]
  );

  // SupportedProduct <---* ProductCapability (One SupportedProduct hasMany ProductCapabilities, ProductCapability belongsTo SupportedProduct)
  models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY].belongsTo(
    models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT]
  );
  models[MODEL_CONSTANTS.NAME.SUPPORTED_PRODUCT].hasMany(
    models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY]
  );

  // ENUM_EXPOSE <---1:1---> PRODUCT_CAPABILITY (One-to-one)
  models[MODEL_CONSTANTS.NAME.ENUM_EXPOSE].hasOne(
    models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY]
  );
  models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY].belongsTo(
    models[MODEL_CONSTANTS.NAME.ENUM_EXPOSE]
  );

  // NUMERIC_EXPOSE <---1:1---> PRODUCT_CAPABILITY (One-to-one)
  models[MODEL_CONSTANTS.NAME.NUMERIC_EXPOSE].hasOne(
    models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY]
  );
  models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY].belongsTo(
    models[MODEL_CONSTANTS.NAME.NUMERIC_EXPOSE]
  );

  // BINARY_EXPOSE <---1:1---> PRODUCT_CAPABILITY (One-to-one)
  models[MODEL_CONSTANTS.NAME.BINARY_EXPOSE].hasOne(
    models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY]
  );
  models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY].belongsTo(
    models[MODEL_CONSTANTS.NAME.BINARY_EXPOSE]
  );

  // ProductCapability <---1:1---> DeviceState (One-to-one)
  models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY].hasOne(
    models[MODEL_CONSTANTS.NAME.DEVICE_STATE]
  );
  models[MODEL_CONSTANTS.NAME.DEVICE_STATE].belongsTo(
    models[MODEL_CONSTANTS.NAME.PRODUCT_CAPABILITY]
  );
};
