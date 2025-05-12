const { Model, DataTypes } = require('sequelize');

class DeviceState extends Model {}

module.exports = (sequelize) => {
  DeviceState.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      boolValue: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        validate: {
          isOnlyValue() {
            if (this.numericValue !== null || this.textValue !== null) {
              throw new Error('Only one value field can be set');
            }
          },
        },
      },
      numericValue: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isOnlyValue() {
            if (this.boolValue !== null || this.textValue !== null) {
              throw new Error('Only one value field can be set');
            }
          },
        },
      },
      textValue: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isOnlyValue() {
            if (this.boolValue !== null || this.numericValue !== null) {
              throw new Error('Only one value field can be set');
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'DeviceState',
      tableName: 'device_states',
      underscored: true,
      timestamps: true,
      validate: {
        exactlyOneValue() {
          const valueCount = [
            this.boolValue !== null,
            this.numericValue !== null,
            this.textValue !== null,
          ].filter(Boolean).length;

          if (valueCount !== 1) {
            throw new Error('Exactly one value field must be set');
          }
        },
      },
    }
  );

  return DeviceState;
};
