const { Tareas } = require("../../db.js");
const { v1 } = require("uuid");

class TareasServices {

    async createTarea(data) {
        try {
          const {
            body: { name, describe },
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
                EntrenadorID:ID
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
}

module.exports = new TareasServices();