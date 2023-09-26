const { Router } = require("express");
const router = Router();
const TaresxMicroService = require("../Services/TaresxMicroService.js");

async function assignTask(req, res) {
  try {
    await TaresxMicroService.createTareaxMicro(req);
    const response = {
      Menssage: "Tarea Asignada con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    console.error("Error al crear el registro:", error);
    res
      .status(500)
      .json({ error: "Error al crear el registro", mjs: error.message });
  }
}

async function getMicrocicloTask(req, res) {
  const { microciclo } = req.params;
  try {
    const tareas = await TaresxMicroService.getMicrocicloTask(microciclo);

    res.status(200).json(tareas);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los registro:", mjs: error.message });
  }
}

module.exports = { assignTask, getMicrocicloTask };
