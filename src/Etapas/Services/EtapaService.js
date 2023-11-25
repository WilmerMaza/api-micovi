const { Etapa } = require("../../db.js");
const { v1 } = require("uuid");

class EtapaService {
  async createEtapa(data) {
    try {
      const {
        body: { name },
        user: {
          dataUser: { ID },
        },
        body,
      } = data;

      const res = await this.getEtapa(name);

      if (!res) {
        body.ID = v1();
        body.EntrenadorID = ID;
        const bodyRequest = body;
        await Etapa.create(bodyRequest);
      } else {
        throw new Error("La Etapa ya ha sido registrado anteriormente");
      }
    } catch (error) {
      console.error("Error al crear el registro:", error);
      throw error;
    }
  }

  async getAll(request) {
    try {
      const {
        dataUser: { ID },
      } = request.user;

      return await Etapa.findAll({
        where: { EntrenadorID: ID },
      });
    } catch (error) {
      console.error("Error al obtener las Etapas:", error);
      throw error;
    }
  }

  async getEtapa(name) {
    return await Etapa.findOne({
      where: { name: name },
    });
  }
}

module.exports = new EtapaService();
