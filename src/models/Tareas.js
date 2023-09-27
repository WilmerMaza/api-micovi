const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Tareas", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    describe: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

};