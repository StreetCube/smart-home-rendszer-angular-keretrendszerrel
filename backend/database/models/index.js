const fs = require('fs');
const path = require('path');
const { associateModels } = require('./associate');

const models = {};

const setupModels = (sequelize) => {
  fs.readdirSync(__dirname)
    .filter((file) => file !== 'index.js' && file !== 'associate.js')
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize);
      models[model.name] = model;
    });

  associateModels(models);
};

module.exports = {
  models,
  setupModels,
};
