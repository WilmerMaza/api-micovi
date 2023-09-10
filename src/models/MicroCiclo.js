const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Microciclos", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    number_micro: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    month: {
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