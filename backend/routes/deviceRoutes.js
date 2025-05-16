const express = require('express');
const router = express.Router();
const zigbeeController = require('../controllers/zigbeeController');

const ROUTER_CONSTANTS = require('../constants/route.constants');

router.post(
  ROUTER_CONSTANTS.ROUTES.DEVICE.INCLUDE,
  zigbeeController.includeDevice
);

router.post(
  ROUTER_CONSTANTS.ROUTES.DEVICE.SEND_COMMAND,
  zigbeeController.sendCommandToDevice
);

router.delete(
  ROUTER_CONSTANTS.ROUTES.DEVICE.EXCLUDE,
  zigbeeController.excludeDevice
);
module.exports = router;
