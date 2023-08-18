const { DataTypes, Sequelize } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('SportsMan', {
        ID: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        identification:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        typeIdentification:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        weight:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        category:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birtDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        birthPlace: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        studyLevelMax: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        institutionNameStudy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sportInstition: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        athleticDiscipline: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phone: {
                type: DataTypes.STRING,
                allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            validate: {
            isUrl: true,
            },
        }

    })
 }

