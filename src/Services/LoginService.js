const { SportsInstitutions, RollSettings, TableLogins,Entrenador } = require('../db.js');
const { AES, enc } = require('crypto-ts');


const login_function = async (Name, Password) => {
    const { SECRETKEY } = process.env
    const pass = AES.decrypt(Password, enc.Utf8.parse(SECRETKEY)).toString(enc.Utf8);
    try {
        const dataBd = await TableLogins.findOne({
            where: {
                user: Name ,
                password : pass
            },
            include: [
                {model: RollSettings, include: SportsInstitutions }
            ]
        });
        
        return dataBd;
    } catch (error) {
     return "user not found";
    }
}

const user_function = async (usuario) => {
   
    try {
        const dataBd = await Entrenador.findOne({
            where: {
                ID: usuario 
            }
        });
        
        return dataBd;
    } catch (error) {
     return "user not found";
    }
}

module.exports = {
    login_function,user_function
};