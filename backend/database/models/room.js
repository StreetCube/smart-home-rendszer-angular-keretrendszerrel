const { DataTypes, Model } = require('sequelize');

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
      },
    }
  );
  return Room;
};
