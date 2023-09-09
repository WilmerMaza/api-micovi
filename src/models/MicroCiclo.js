const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Microciclos", {
    month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_initial: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_end: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    stages: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Por asignar"
    },
    number_days: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
  });

};