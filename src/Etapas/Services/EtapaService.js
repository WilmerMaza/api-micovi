const { Etapa, Microciclos } = require("../../db.js");
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

  async assingEtapa(request) {
    try {
      const listEtapas = request.body;
      listEtapas.forEach(async (element) => {
        const { MicrocicloID, MacrocicloID, EtapaID } = element;

        const microcicloData = await this.getMicrociclo(
          MicrocicloID,
          MacrocicloID
        );
        if (microcicloData) {
          const etapaData = await this.getEtapaID(EtapaID);
          const body = {
            ...microcicloData,
            EtapaID,
            stages: etapaData.name,
          };

          const [rowsUpdated, [updatedmicrociclo]] = await Microciclos.update(
            body,
            {
              where: { ID: MicrocicloID, MacrocicloID },
              returning: true,
            }
          );

          if (rowsUpdated[0] === 0) {
            throw new Error("No se pudo actualizar el microciclo");
          }
        } else {
          throw new Error("No Existe Microciclo");
        }
      });
    } catch (error) {
      console.error("Error al Asignar las Etapas:", error);
      throw error;
    }
  }

  async getEtapa(name) {
    return await Etapa.findOne({
      where: { name: name },
    });
  }
  async getEtapaID(EtapaID) {
    return await Etapa.findOne({
      where: { ID: EtapaID },
    });
  }

  async getMicrociclo(MicrocicloID, MacrocicloID) {
    return await Microciclos.findOne({
      where: { ID: MicrocicloID, MacrocicloID },
    });
  }

  async updateEtapa(data) {
    try {
      const { name, descripcion, ID } = data.body;

      const [rowsUpdated, [updatedEtapa]] = await Etapa.update(
        { name, descripcion },
        {
          where: { ID },
          returning: true,
        }
      );

      if (rowsUpdated[0] === 0) {
        throw new Error("No se pudo actualizar la etapa");
      }
    } catch (error) {
      throw new Error("Error al actualizar:", error);
    }
  }
}

module.exports = new EtapaService();
