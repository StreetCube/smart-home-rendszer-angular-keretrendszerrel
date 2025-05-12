const { DataTypes, Model } = require('sequelize');

class BinaryExpose extends Model {}

module.exports = (sequelize) => {
  BinaryExpose.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      value_on: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value_off: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value_toggle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'BinaryExpose',
      tableName: 'binary_exposes',
      underscored: true,
      timestamps: true,
    }
  );

  return BinaryExpose;
};
