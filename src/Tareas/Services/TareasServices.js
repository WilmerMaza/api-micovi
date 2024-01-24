const { Tareas } = require("../../db.js");
const { v1 } = require("uuid");

class TareasServices {
  async createTarea(data) {
    try {
      const {
        body: { name, describe, color },
        user: {
          dataUser: { ID },
        },
      } = data;

      const tarea = await this.getTarea(name);

      if (!tarea) {
        data.body.ID = v1();
        try {
          await Tareas.create({
            ID: v1(),
            name: name,
            describe: describe,
            color: color,
            EntrenadorID: ID,
          });
        } catch (error) {
          console.error("Error al crear 'Tarea':", error);
          throw error;
        }
      } else {
        throw new Error("Tarea ya ha sido registrado anteriormente");
      }
    } catch (error) {
      console.error("Error al crear el registro:", error);
      throw error;
    }
  }

  async getTarea(tareaName) {
    return await Tareas.findOne({
      where: { name: tareaName },
    });
  }

  async getTareasEntrenador(data) {
    try {
      const {
        user: {
          dataUser: { ID },
        },
      } = data;

      return await Tareas.findAll({
        where: { EntrenadorID: ID },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteTarea(request) {
    try {
      const {
        dataUser: { ID },
      } = request.user;

      const idTarea = request.params.idTarea;
      await Tareas.destroy({
        where: { EntrenadorID: ID, ID: idTarea },
      });
    } catch (error) {
      console.error("Error al Eliminar la Tarea:", error);
      throw error;
    }
  }

  async updateTareaService(data) {
    try {
      const { name, describe, color, ID } = data.body;

      const [rowsUpdated, [updatedTarea]] = await Tareas.update(
        { name, describe, color },
        {
          where: { ID },
          returning: true,
        }
      )

      if (rowsUpdated[0] === 0) {
        throw new Error("No se pudo actualizar la tarea");
      } 
      
    }
    catch(error) {
      throw new Error('Error al actualizar:', error);
    }

  }
}

module.exports = new TareasServices();
