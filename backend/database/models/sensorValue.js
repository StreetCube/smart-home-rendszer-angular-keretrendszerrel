const { DataTypes, Model } = require('sequelize');

class SensorValues extends Model { }
module.exports = (sequelize) => {
    SensorValues.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
        sequelize,
        modelName: 'SensorValue',
        tableName: 'sensor_values',
        timestamps: true,
    });
    return SensorValues;
}