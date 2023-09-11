const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Macrociclos", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_initial: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_end: {
        type: DataTypes.DATE,
        allowNull: false,
    }
  });

};