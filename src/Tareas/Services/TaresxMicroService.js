const { TareasMicrociclo, Tareas, Microciclos } = require("../../db.js");
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
      const tasks = await TareasMicrociclo.findAll({
        where: { MicrocicloID: idMicrociclo },
        attributes: ['fechaInicio', 'fechaFin'], // Selecciona las columnas de TareasMicrociclo que deseas traer
        include: [
          {
            model: Tareas,
            attributes: ['name','color'], // Selecciona las columnas de Tareas que deseas traer
          },
        ],
      });
  
      return tasks;
    } catch (error) {
      throw new Error(error);
    }
  }



}

module.exports = new TaresxMicroService();
