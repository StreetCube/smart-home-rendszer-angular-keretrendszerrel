const express = require('express');
const router = express.Router();
const authController = require('../auth/authController');
const ROUTER_CONSTANTS = require('../constants/route.constants');

const authRoutes = ROUTER_CONSTANTS.ROUTES.AUTH;

router.post(authRoutes.LOGIN, authController.login);
router.get(authRoutes.STATUS, authController.checkLoggedinStatus);
router.post(authRoutes.LOGOUT, authController.logout);

module.exports = router;
