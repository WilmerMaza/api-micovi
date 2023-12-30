const { Router } = require("express");
const router = Router();
const DiciplinaService = require("../Services/DiciplinaService.js");

router.get("/getAll", async (req, res) => {
  try {
    const Diciplina = await DiciplinaService.getAll(req);
    res.json(Diciplina);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" , mjs: error.message });
  }
});


router.post("/create", async (req, res) => {
  try {
    await DiciplinaService.createDiciplina(req);
    const response = {
      Menssage: "Diciplina creada con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el registro", mjs: error.message });
  }
});

module.exports = router;
