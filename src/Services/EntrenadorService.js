const {
  Entrenador,
  SportsInstitutions,
  RollSettings,
  TableLogins,
} = require("../db.js");
const { v1 } = require("uuid");
const { AES, enc } = require('crypto-ts');

class EntrenadorService {
  async createEntrenador(data) {
    const {
      body: { identification, password },
      user: {
        dataUser: { institutionName },
      },
    } = data;

    const { SECRETKEY } = process.env
    const pass = AES.decrypt(password, enc.Utf8.parse(SECRETKEY)).toString(enc.Utf8);

    const res = await this.getEntrenador(identification);

    if (!res) {
      try {
        data.body.ID = v1();
        const institution = await this.getInstitucion(institutionName);
        const {
          dataValues: { ID },
        } = institution;

        const bodyRequest = data.body;
        bodyRequest.SportsInstitutionID = ID;

        const entrenadors = await Entrenador.create(bodyRequest);

        const rollSetting = await RollSettings.create({
          ID: v1(),
          SportsInstitutionID: entrenadors.SportsInstitutionID,
          account: "Entrenador",
          usuario: entrenadors.ID,
        });

        await TableLogins.create({
          ID: v1(),
          user: entrenadors.email,
          password: pass,
          RollSettingID: rollSetting.ID,
        });
      } catch (error) {
        return error;
      }
    } else {
      return "El Entrenador ya ha sido registrado anteriormente";
    }
  }

  async getAllEntrenador(SportsInstitutionID) {
    return await Entrenador.findAll({
      where: { SportsInstitutionID: SportsInstitutionID },
    });
  }

  async getEntrenador(identification) {
    return await Entrenador.findOne({
      where: { identification: identification },
    });
  }

  async getInstitucion(institutionName) {
    return await SportsInstitutions.findOne({
      where: { institutionName: institutionName },
    });
  }

  // async updateSportsMan(data) {
  //   const [rowsUpdated, [updatedSportsMan]] = await SportsMan.update(data.data, {
  //     where: { ID: data.ID },
  //     returning: true,
  //   });
  //   return rowsUpdated === 0 ? null : updatedSportsMan;
  // }

  // async deleteSportsMan(id) {
  //   const rowsDeleted = await SportsMan.destroy({
  //     where: { ID: id },
  //   });
  //   return rowsDeleted === 0 ? false : true;
  // }
}

module.exports = new EntrenadorService();
