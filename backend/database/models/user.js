const { DataTypes, Model } = require('sequelize');
const argon2 = require('argon2');

class User extends Model {}
module.exports = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
      },
      password_digest: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      permission: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'User',
      underscored: true,
      tableName: 'users',
      timestamps: true,
    }
  );

  User.beforeCreate(async (user) => {
    const password = user.get('password');
    const passwordDigest = user.get('password_digest');

    if (user.isNewRecord) {
      if (password) {
        const hashedPassword = await argon2.hash(password);
        user.set('password_digest', hashedPassword);
      } else if (!passwordDigest) {
        throw new Error(
          'Either "password" or "password_digest" must be provided during user creation.'
        );
      }
    }
  });

  User.afterCreate((user) => {
    delete user.dataValues.password;
    delete user.dataValues.password_digest;
  });

  return User;
};
