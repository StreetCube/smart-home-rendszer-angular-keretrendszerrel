const { Sequelize } = require('sequelize');

const config = require('../config');

const sequelize = new Sequelize(config.database.database, config.database.name, config.database.password, {
    ...config.database.options,
    define: {
        underscored: true
    }
})

module.exports = sequelize;