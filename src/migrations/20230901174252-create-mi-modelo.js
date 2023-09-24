'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SubGrupos', 'EntrenadorID', {
      type: Sequelize.UUID,
      references: {
        model: 'Entrenadors', 
        key: 'ID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SubGrupos', 'EntrenadorID');
  },
};