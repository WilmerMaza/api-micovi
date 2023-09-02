const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("PlanAnual", {
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
    year: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  });

};