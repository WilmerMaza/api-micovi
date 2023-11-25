const { Router } = require("express");
const router = Router();
const EtapaService = require("../Services/EtapaService.js");
const { verificationToken } = require("../../Utils/validateToken.js");

router.get("/getAll", verificationToken, async (req, res) => {
  try {
    const Categoria = await EtapaService.getAll(req);
    res.json(Categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});


router.post("/create",verificationToken, async (req, res) => {
  try {
    await EtapaService.createEtapa(req);
    const response = {
      Menssage: "Etapa creada con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    console.error("Error al crear el registro:", error);
    res
      .status(500)
      .json({ error: "Error al crear el registro", mjs: error.message });
  }
});

module.exports = router;
