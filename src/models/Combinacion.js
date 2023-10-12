const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("Combinacion", {
      ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Abbreviation: {
        type: DataTypes.STRING,
      },
      Description: { type: DataTypes.STRING },
      VisualIllustration: { type: DataTypes.STRING },
      Relationship: { type: DataTypes.STRING },
    });

    sequelize.define("RelacionCombinados", {
        ID: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        EjercicioID: { type: DataTypes.STRING },
        CombinacionID: { type: DataTypes.STRING }
    })
}