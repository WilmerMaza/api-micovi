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

async function getTareas(req, res) {
  try {
    const tareas = await TareasServices.getTareasEntrenador(req);
    res.status(200).send(tareas);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al traer registros", mjs: error.message });
    throw new Error("Error al traer registros:" + error.Menssage);
  }
}

module.exports = { crearTareas , getTareas};
