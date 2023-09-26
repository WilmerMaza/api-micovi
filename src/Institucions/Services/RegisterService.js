const { v1 } = require('uuid');
const { AES, enc } = require('crypto-ts');
require('dotenv').config({path: '../../.env'});
const { SECRETKEY } = process.env
const { SportsInstitutions, RollSettings, TableLogins, PlanUserNames } = require('../../db.js');
const { conn } = require("../../db.js");
const { formatDate } = require("../../Utils/formatDate.js")

const register_function = async (dataBody) => {
    const { email, 
        institutionName,
        legalRepresentative,
        character,
        pais,
        sede,
        webPage,
        phone,
        image,
        user,
        password,
        roll
    } = dataBody;


    const pass = AES.decrypt(password, enc.Utf8.parse(SECRETKEY)).toString(enc.Utf8);
    const sportInstitution = await SportsInstitutions.create({
        ID: v1(),
        email,
        institutionName,
        legalRepresentative,
        character,
        pais,
        sede,
        webPage,
        phone,
        image
    })

       const rollSetting = await RollSettings.create({
            ID: v1(),
            SportsInstitutionID: sportInstitution.ID, 
            account: roll,
            usuario:sportInstitution.ID
        })


       await TableLogins.create({
            ID: v1(),
            user,
            password: pass,
            RollSettingID: rollSetting.ID
        })
        await captureOrderFree(sportInstitution);
        return sportInstitution;
}


const captureOrderFree = async (sportInstitution) => {
    const { ID, institutionName, email } = sportInstitution.dataValues;
    const idsport = ID;
    try {
        const resultPlan = await conn.query("SELECT * FROM planes WHERE planname = 'PRUEBAS GRATIS'");
        const {id , planname, price, plantime, caracteristicas } = resultPlan[1].rows[0];

        await PlanUserNames.create({
            ID: v1(),
            userName:institutionName,
            SportsInstitutionID:idsport,
            planName : planname,
            amount: price,
            currency: 'COP',
            characteristicsPlan: caracteristicas,
            process: 'COMPLETED',
            buyId: v1(),
            initialDate: formatDate(0),
            endDate: formatDate(plantime),
            email_address_paypal: email,
            account_status: 'VERIFIED',
            planId: id
        });

      } catch (error) {
        await SportsInstitutions.destroy({
            where: {ID}
        })
         throw new Error("Error al buscar el plan: ", error);
      }
}

module.exports = {register_function}