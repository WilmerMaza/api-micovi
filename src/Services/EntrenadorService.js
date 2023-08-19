const {
  Entrenador,
  SportsInstitutions,
  RollSettings,
  TableLogins,
} = require("../db.js");
const { v1 } = require("uuid");
const { AES, enc } = require("crypto-ts");
const { Op, fn, col } = require("sequelize");

class EntrenadorService {
  async createEntrenador(data) {
    try {
      const {
        body: { identification, password },
        user: {
          dataUser: { institutionName },
        },
      } = data;

      const { SECRETKEY } = process.env;
      const pass = AES.decrypt(password, enc.Utf8.parse(SECRETKEY)).toString(
        enc.Utf8
      );

      const res = await this.getEntrenador(identification);

      if (!res) {
        data.body.ID = v1();
        const institution = await this.getInstitucion(institutionName);
        const {
          dataValues: { ID },
        } = institution;

        const bodyRequest = data.body;
        bodyRequest.SportsInstitutionID = ID;

        const entrenadors = await Entrenador.create(bodyRequest);

        let rollSetting;
        try {
          rollSetting = await RollSettings.create({
            ID: v1(),
            SportsInstitutionID: entrenadors.SportsInstitutionID,
            account: "Entrenador",
            usuario: entrenadors.ID,
          });
        } catch (error) {
          console.error("Error al crear 'Roll':", error);
          throw error;
        }

        try {
          await TableLogins.create({
            ID: v1(),
            user: entrenadors.email,
            password: pass,
            RollSettingID: rollSetting.ID,
          });
        } catch (error) {
          console.error("Error al crear 'Usuario Login':", error);
          throw error;
        }
      } else {
        throw new Error("El Entrenador ya ha sido registrado anteriormente");
      }
    } catch (error) {
      console.error("Error al crear el registro:", error);
      throw error;
    }
  }

  async getAllEntrenador(request) {
    try {
      const {
        body: { name, identification },
        user: {
          dataUser: { ID },
        },
      } = request;

      const SportsInstitutionID = ID;

      const whereClause = { SportsInstitutionID };

      if (identification) {
        whereClause.identification = identification;
      }

      if (name) {
        whereClause.name = {
          [Op.iLike]: `%${name}%`
        };
      }

      return await Entrenador.findAll({
        where: whereClause,
      });
    } catch (error) {
      console.error("Error al obtener los entrenadores:", error);
      throw error;
    }
  }

  async updateEntrenador(dataUpdate) {
    const {
      body,
      user: {
        dataUser: { ID },
      },
    } = dataUpdate;

    try {
      const rowsUpdated = await Entrenador.update(body, {
        where: { identification: body.identification, SportsInstitutionID: ID },
        returning: true,
      });

      if (rowsUpdated[0] === 0) {
        // No se actualizó ningún registro
        return null;
      }

      return "Entrenador actualizado con éxito";
    } catch (error) {
      console.error("Error al actualizar el entrenador:", error);
      throw error;
    }
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
}

module.exports = new EntrenadorService();
