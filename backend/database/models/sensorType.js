const { DataTypes, Model } = require('sequelize');

class SensorTypes extends Model { }

module.exports = (sequelize) => {
    SensorTypes.init(
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
            unit: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
        sequelize,
        modelName: 'SensorType',
        tableName: 'sensor_types',
        timestamps: true,
    });
    return SensorTypes;
}