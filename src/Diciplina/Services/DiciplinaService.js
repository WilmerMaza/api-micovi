const { Diciplinas } = require("../../db.js");
const { v1 } = require("uuid");
const { TypeAccount } = require("../../Utils/constants.js");

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
        dataUser: { ID, SportsInstitutionID, account },
      } = request.user;

      const IDSearch =
        account !== TypeAccount.Entrenador ? ID : SportsInstitutionID;

      return await Diciplinas.findAll({
        where: { SportsInstitutionID: IDSearch },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateDisciplina(data) {
    try {
      const { name, describe, ID } = data.body;

      const [rowsUpdated, [updatedDisciplina]] = await Diciplinas.update(
        { name, describe },
        {
          where: { ID },
          returning: true,
        }
      )

      if (rowsUpdated[0] === 0) {
        throw new Error("No se pudo actualizar la disciplina");
      } 
      
    }
    catch(error) {
      throw new Error('Error al actualizar:', error);
    }

  }

  async getDiciplina(name) {
    return await Diciplinas.findOne({
      where: { name: name },
    });
  }
}

module.exports = new DiciplinaService();
