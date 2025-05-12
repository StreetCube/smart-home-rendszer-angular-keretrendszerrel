const { DataTypes, Model } = require('sequelize');

class EnumExpose extends Model {}

module.exports = (sequelize) => {
  EnumExpose.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      values: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'EnumExpose',
      tableName: 'enum_exposes',
      underscored: true,
      timestamps: true,
    }
  );

  return EnumExpose;
};
