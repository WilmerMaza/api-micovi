const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Ejercicios", {
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
    IsCombined:{type: DataTypes.BOOLEAN },
    IdCombined: {type: DataTypes.STRING}
  });

  sequelize.define("SubGrupos", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    NameSubGrupo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abreviatura: {
      type: DataTypes.STRING,
    },
    Description: { type: DataTypes.STRING },
  });

  sequelize.define("Grupos", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    NameGrupo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Abbreviation: {
      type: DataTypes.STRING,
    },
    Description: { type: DataTypes.STRING(255000) },
  });

  sequelize.define("Indicadores", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    IndicatorsName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Abbreviation: {
      type: DataTypes.STRING,
    },
    Description: { type: DataTypes.STRING },
    AbsolutePercentage: { type: DataTypes.DECIMAL },
    CalificationLevel: { type: DataTypes.INTEGER }
  });

  sequelize.define("Levels", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    LevelNumber: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    LevelName: { type: DataTypes.STRING},
    Description: { type: DataTypes.STRING },
  });

  sequelize.define("UnitTypes", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  sequelize.define("Unitsofmeasurements", {
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
    Description: { type: DataTypes.STRING(25500) },
  });

  sequelize.define("Patterns", {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    performance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stretch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
