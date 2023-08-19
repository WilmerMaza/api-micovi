const { Router } = require("express");
const router = Router();
const EntrenadorService = require("../Services/EntrenadorService.js");
const { verificationToken } = require("../Utils/validateToken.js");

router.post("/getAll", verificationToken, async (req, res) => {
  try {
    const Entrenador = await EntrenadorService.getAllEntrenador(req);
    res.json(Entrenador);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});

router.post("/create", async (req, res) => {
  try {
    await EntrenadorService.createEntrenador(req);
    const response = {
      Menssage: "Entrenador creado con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    console.error("Error al crear el registro:", error);
    res
      .status(500)
      .json({ error: "Error al crear el registro", mjs: error.message });
  }
});

router.put("/update", verificationToken, async (req, res) => {
  try {
    const Entrenador = await EntrenadorService.updateEntrenador(req);
    if (Entrenador) {
      const response = {
        Menssage: "Registro Actualizado Exitosamente",
      };
      res.status(200).send(response);
    } else {
      res.status(404).json({ error: "El registro no fue encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar el registro", mjs: error.message });
  }
});

module.exports = router;
