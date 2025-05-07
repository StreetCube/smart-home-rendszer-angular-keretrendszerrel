const express = require('express');
const router = express.Router();
const validateModel = require('../middleware/validateModel');
const ROUTER_CONSTANTS = require('../constants/route.constants');

const authRoutes = require('../routes/authRoutes');
const crudRoutes = require('../routes/crudRoutes');
const conditionalAuthorizationMiddleware = require('../middleware/conditionalAuthorizationMiddleware');

router.use(ROUTER_CONSTANTS.BASE_ROUTE.AUTH, authRoutes);
router.use(
  ROUTER_CONSTANTS.BASE_ROUTE.CRUD,
  validateModel,
  conditionalAuthorizationMiddleware,
  crudRoutes
);

//healthcheck
router.use(
  '/healthcheck',
  require('express-healthcheck')({
    healthy: function () {
      return { status: 'ok', timestamp: new Date().toISOString() };
    },
  })
);

module.exports = router;
