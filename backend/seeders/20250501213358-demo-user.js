'use strict';

const argon2 = require('argon2');
const setupModels = require('../database/models/index').setupModels;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    setupModels(queryInterface.sequelize);
    const hashedPassword = await argon2.hash('Testpass123');
    console.log(queryInterface.sequelize.models);
    return queryInterface.sequelize.models.User.bulkCreate([
      {
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
