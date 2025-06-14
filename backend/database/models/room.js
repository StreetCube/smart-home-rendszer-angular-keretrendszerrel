const { DataTypes, Model } = require('sequelize');
const zigbeeController = require('../../controllers/zigbeeController');

class Room extends Model {}
module.exports = (sequelize) => {
  Room.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Room',
      tableName: 'rooms',
      timestamps: true,
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['UserId'] },
      },
      scopes: {
        withUserId: {
          attributes: { include: ['UserId'] },
        },
        withUser(id) {
          return {
            where: { UserId: id },
            attributes: { exclude: ['UserId'] },
          };
        },
      },
    }
  );

  Room.prototype.getActiveDeviceNumber = async function () {
    const products = await this.getProducts();
    return products.filter((product) =>
      zigbeeController.getStateOfDevice(product.ieeeAddress)
    ).length;
  };
  return Room;
};
