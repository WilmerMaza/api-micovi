const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("TareasMicrociclo", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    fechaInicio: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  });

};