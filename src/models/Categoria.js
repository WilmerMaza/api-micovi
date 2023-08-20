const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Categoria", {
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
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

};
