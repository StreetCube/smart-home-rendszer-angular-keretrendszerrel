const { Model, DataTypes } = require('sequelize');

class SupportedProduct extends Model {}

module.exports = (sequelize) => {
  SupportedProduct.init(
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
      protocol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SupportedProduct',
      tableName: 'supported_products',
      timestamps: true,
    }
  );
  return SupportedProduct;
};
