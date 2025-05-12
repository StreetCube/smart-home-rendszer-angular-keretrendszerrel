'use strict';
const setupModels = require('../database/models/index').setupModels;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    setupModels(queryInterface.sequelize);
    await queryInterface.sequelize.models.Room.bulkCreate([
      {
        id: 'c50efa4c-354a-42ae-8877-76cd9dbaa09d',
        name: 'Living Room',
        description: 'A cozy living room with a sofa and TV.',
        UserId: 'c5bcb718-ea5b-4165-b7ae-c6a66097da9f',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
