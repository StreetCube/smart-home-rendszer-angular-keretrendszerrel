const { DataTypes, Model } = require('sequelize');

class supportedCommand extends Model { }
module.exports = (sequelize) => {
    supportedCommand.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
        }, {
        sequelize,
        modelName: 'SupportedCommand',
        tableName: 'supported_commands',
        timestamps: true,
    });
    return supportedCommand;
}