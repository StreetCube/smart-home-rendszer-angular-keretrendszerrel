const { Model, DataTypes } = require('sequelize');

class ProductCapability extends Model {}

module.exports = (sequelize) => {
  ProductCapability.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      access: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          'binary',
          'numeric',
          'enum',
          'text',
          'composite',
          'list'
        ),
      },
      property: {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ProductCapability',
      underscored: true,
      tableName: 'product_capabilities',
      timestamps: true,
    }
  );

  return ProductCapability;
};
