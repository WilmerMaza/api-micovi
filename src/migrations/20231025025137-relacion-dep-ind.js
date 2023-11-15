'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Indicadores', 'SportsManID', {
      type: Sequelize.UUID,
      references: {
        model: 'SportsMans',
        key: 'ID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Indicadores', 'SportsMans');
  }
};