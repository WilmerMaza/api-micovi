const { DataTypes, Sequelize } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('SportsInstitutions', {
    ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique:true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
        validate: {
          isEmail: true,
        },
    },
    institutionName: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    legalRepresentative: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    character: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sede: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    webPage: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      }
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
    
  });

  sequelize.define('RollSettings', {
    ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique:true,
        allowNull: false
    },
    account: {
    type: DataTypes.ENUM(["Entrenador", "Admin", "SuperAdmin"]),
    defaultValue: "Admin",
    },
    usuario:{
        type: DataTypes.UUID,
        allowNull: false
    }
    
  });
  
  sequelize.define('TableLogins', {
    ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique:true,
        allowNull: false
    },
    user: {
    type: DataTypes.STRING,
    allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
    
  });

}