const { TareasMicrociclo } = require("../../db.js");
const { v1 } = require("uuid");

class TaresxMicroService {
 

  async createTareaxMicro(data) {
    const {
      body: { fechaInicio, fechaFin, MicrocicloID, TareaID },
    } = data;

    try {
      await TareasMicrociclo.create({
        ID: v1(),
        fechaInicio,
        fechaFin,
        MicrocicloID,
        TareaID,
      });
    } catch (error) {
      throw new Error("Error al Asignar Tarea:", error);
    }
  }

  async getMicrocicloTask(idMicrociclo) {
    try {
      return await TareasMicrociclo.findAll({
        where: { MicrocicloID: idMicrociclo },
      });
    } catch (error) {
      throw new Error(error);
    }
  }



}

module.exports = new TaresxMicroService();
