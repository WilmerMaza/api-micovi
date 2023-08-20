const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("HistorialCategorico", {

    FechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    FechaFin: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  });
};
