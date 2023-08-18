const { v1 } = require('uuid');
const { AES, enc } = require('crypto-ts');
require('dotenv').config({path: '../../.env'});
const { SECRETKEY } = process.env
const { SportsInstitutions, RollSettings, TableLogins } = require('../db.js');

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

        return sportInstitution;
}

module.exports = {register_function}