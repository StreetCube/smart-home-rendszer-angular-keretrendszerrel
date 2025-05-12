'use strict';

const argon2 = require('argon2');
const setupModels = require('../database/models/index').setupModels;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    setupModels(queryInterface.sequelize);
    const hashedPassword = await argon2.hash('Testpass123');
    return queryInterface.sequelize.models.User.bulkCreate([
      {
        id: 'c5bcb718-ea5b-4165-b7ae-c6a66097da9f',
        username: 'admin',
        password_digest: hashedPassword,
        email: 'testMail@test.com',
        permission: 'admin',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('User', null, {});
  },
};
