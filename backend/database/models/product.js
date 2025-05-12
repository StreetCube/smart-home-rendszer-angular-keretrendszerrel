const { DataTypes, Model } = require('sequelize');

class Product extends Model {}

module.exports = (sequelize) => {
  Product.init(
    {
      id: {
        //ieee_address
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
    },
    {
      sequelize,
      modelName: 'Product',
      underscored: true,
      tableName: 'products',
      timestamps: true,
    }
  );

  return Product;
};
