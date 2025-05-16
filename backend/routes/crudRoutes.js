const express = require('express');
const router = express.Router();
const ROUTER_CONSTANTS = require('../constants/route.constants');
const apiController = require('../controllers/apiController');
const roomCrudService = require('../services/roomCrudService');
const productCrudService = require('../services/productCrudService');

const CrudRoutes = ROUTER_CONSTANTS.ROUTES.CRUD;

router.post(CrudRoutes.CREATE, apiController.createPreparation);
router.get(CrudRoutes.GET_ALL, apiController.getAll);

router.get(
  CrudRoutes.ROOMS_WITH_PRODUCT_NUMBERS,
  roomCrudService.getRoomsWithProductNumbers
);

router.get(
  CrudRoutes.GET_PRODUCTS_FOR_ROOM,
  productCrudService.getProductsForRoom
);

router.put(CrudRoutes.UPDATE, apiController.updateModel);

router.delete(CrudRoutes.DELETE, apiController.deleteModel);

module.exports = router;
