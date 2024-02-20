const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Calificacion", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    minimo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maximo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    promedio: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
  });

};
