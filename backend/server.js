require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./api/apiRoutes');
const modelIndex = require('./database/models/index');
const cookieParser = require('cookie-parser');
const logger = require('./util/logger');

const db = require('./database/sequelize');

const config = require('./config');
const ROUTE_CONSTANTS = require('./constants/route.constants');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Prefix all routes with /api
app.use(ROUTE_CONSTANTS.BASE_ROUTE.API, apiRoutes);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

modelIndex.setupModels(db);
db.createSchema(config.database.options.schema)
  .then(() => {
    logger.debug('Schema created successfully!');
    syncDatabase();
  })
  .catch((error) => {
    if (error.parent.code === '42P06') {
      logger.warn('Schema already exists!');
      syncDatabase();
    } else {
      logger.error('Error creating schema:', error);
      throw error;
    }
  });

const syncDatabase = () => {
  // db.sync({ force: true })
  db.sync()
    .then(() => {
      logger.info('Database synced successfully!');
    })
    .catch((error) => {
      logger.error('Error syncing database:', error);
    });
};
