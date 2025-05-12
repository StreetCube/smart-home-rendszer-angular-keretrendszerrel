const { DataTypes, Model } = require('sequelize');

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
        unique: true,
      },
      product_type: {
        type: DataTypes.ENUM(
          'light',
          'cover',
          'lock',
          'climate',
          'fan',
          'switch'
        ),
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
