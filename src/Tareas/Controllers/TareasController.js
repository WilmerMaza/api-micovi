const TareasServices = require("../Services/TareasServices.js");


async function crearTareas(req, res) {
    try {
        await TareasServices.createTarea(req);
        const response = {
          Menssage: "Tarea creado con éxito",
        };
        res.status(200).send(response);
      } catch (error) {
        console.error("Error al crear el registro:", error);
        res
          .status(500)
          .json({ error: "Error al crear el registro", mjs: error.message });
      }
}

module.exports = {crearTareas};
