const express = require('express');
const router = express.Router();
const ROUTER_CONSTANTS = require('../constants/route.constants');
const apiController = require('../controllers/apiController');

const CrudRoutes = ROUTER_CONSTANTS.ROUTES.CRUD;

router.post(CrudRoutes.CREATE, apiController.createPreparation);
router.get(CrudRoutes.GET_ALL, apiController.getAll);

module.exports = router;
