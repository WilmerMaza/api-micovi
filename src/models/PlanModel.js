const { DataTypes, Sequelize } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('PlanUserNames', {
    ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique:true,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    planName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    characteristicsPlan: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    process: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    buyId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    initialDate: {
        type: DataTypes.DATE
    },
    endDate: {
        type: DataTypes.DATE
    },
    purchaseIdentifier: {
        type: DataTypes.STRING
    },
    account_status: {
        type: DataTypes.STRING
    },
    email_address_paypal: {
        type: DataTypes.STRING
    },
    planId: {
        type: DataTypes.UUID
    }
  });

}