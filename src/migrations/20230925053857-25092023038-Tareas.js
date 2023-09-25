'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tareas', 'EntrenadorID', {
      type: Sequelize.UUID,
      references: {
        model: 'Entrenadors', 
        key: 'ID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tareas', 'EntrenadorID');
  }
};
