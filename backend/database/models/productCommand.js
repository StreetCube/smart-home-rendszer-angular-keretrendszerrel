const { DataTypes, Model } = require('sequelize');



class ProductCommand extends Model { }

module.exports = (sequelize) => {
    ProductCommand.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            command: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }, {
        sequelize,
        modelName: 'ProductCommand',
        tableName: 'product_commands',
        timestamps: true,
    })
    return ProductCommand;
}