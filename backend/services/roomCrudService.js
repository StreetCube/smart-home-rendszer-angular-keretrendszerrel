const models = require('../database/models').models;
const logger = require('../util/logger');
const MODEL_CONSTANTS = require('../constants/model.constants');
const HTTP_CONSTANTS = require('../constants/http.constants');
const zigbeeController = require('../controllers/zigbeeController');
const CustomError = require('../util/customError');

exports.getRoomsWithProductNumbers = async (req, res) => {
  const user = req.user;
  try {
    const rooms = await models[MODEL_CONSTANTS.NAME.ROOM].findAll({
      where: {
        UserId: user.id,
      },
      include: [
        {
          model: models[MODEL_CONSTANTS.NAME.PRODUCT],
          attributes: ['ieeeAddress'],
        },
      ],
    });

    const roomsWithActiveDevices = rooms
      .map((room) => {
        const products = room.Products || [];
        const activeCount = products.filter((product) =>
          zigbeeController.getStateOfDevice(product.ieeeAddress)
        ).length;
        return {
          ...room.dataValues,
          activeDevices: activeCount,
        };
      })
      .sort((a, b) => b.activeDevices - a.activeDevices);

    return res.status(HTTP_CONSTANTS.CODE.OK).json({
      message: 'Rooms with product numbers fetched successfully',
      code: HTTP_CONSTANTS.CODE.OK,
      data: roomsWithActiveDevices,
    });
  } catch (error) {
    logger.error(`Error fetching rooms with product numbers: ${error.message}`);
    return res.status(HTTP_CONSTANTS.CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      code: HTTP_CONSTANTS.CUSTOM_CODE.API.ERROR_GETTING_RESOURCE,
    });
  }
};
