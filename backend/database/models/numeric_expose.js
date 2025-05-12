const { DataTypes, Model } = require('sequelize');

class NumericExpose extends Model {}

module.exports = (sequelize) => {
  NumericExpose.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      value_min: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      value_max: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      value_step: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'NumericExpose',
      underscored: true,
      tableName: 'numeric_exposes',
      timestamps: true,
    }
  );

  return NumericExpose;
};
