const { Diciplinas } = require("../../db.js");
const { v1 } = require("uuid");

class DiciplinaService {
  async createDiciplina(data) {
    try {
      const {
        body: { name },
        user: {
          dataUser: { ID },
        },
        body,
      } = data;

      const res = await this.getDiciplina(name);

      if (!res) {
        body.ID = v1();
        body.SportsInstitutionID = ID;
        const bodyRequest = body;
        await Diciplinas.create(bodyRequest);
      } else {
        throw "La Diciplina ya ha sido registrado anteriormente";
      }
    } catch (error) {
      throw error;
    }
  }

  async getAll(request) {
    try {
      const {
        dataUser: { ID, SportsInstitutionID },
      } = request.user;

      const IDSearch =
        SportsInstitutionID === undefined ? ID : SportsInstitutionID;

      return await Diciplinas.findAll({
        where: { SportsInstitutionID: IDSearch },
      });
    } catch (error) {
      throw error;
    }
  }

  async getDiciplina(name) {
    return await Diciplinas.findOne({
      where: { name: name },
    });
  }
}

module.exports = new DiciplinaService();
