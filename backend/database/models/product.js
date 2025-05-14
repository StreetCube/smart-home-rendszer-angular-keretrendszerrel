const { DataTypes, Model } = require('sequelize');
const zigbeeController = require('../../controllers/zigbeeController');

class Product extends Model {}

module.exports = (sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ieeeAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      state: {
        type: DataTypes.VIRTUAL,
        get() {
          return zigbeeController.getStateOfDevice(this.ieeeAddress);
        },
      },
    },
    {
      sequelize,
      scopes: {
        withUser(id) {
          return {
            include: [
              {
                model: sequelize.models.Room,
                where: { UserId: id },
                required: true,
              },
              {
                model: sequelize.models.SupportedProduct,
                include: [
                  {
                    model: sequelize.models.ProductCapability,
                    attributes: ['id', 'description'],
                    required: true,
                  },
                ],
              },
            ],
          };
        },
      },
      modelName: 'Product',
      underscored: true,
      tableName: 'products',
      timestamps: true,
    }
  );

  return Product;
};
