'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PlanUserNames', 'nuevaColumna', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "soy nueva",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PlanUserNames', 'nuevaColumna');
  }
};