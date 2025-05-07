const { DataTypes, Model } = require('sequelize');

class Product extends Model {}

module.exports = (sequelize) => {
  Product.init(
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
    }
  );

  return Product;
};
