const { Router } = require("express");
const router = Router();
const EtapaService = require("../Services/EtapaService.js");

router.get("/getAll", async (req, res) => {
  try {
    const Categoria = await EtapaService.getAll(req);
    res.json(Categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" , mjs: error.message });
  }
});


router.put("/AssingEtapa", async(req,res)=>{
  try {
    await EtapaService.assingEtapa(req);
    const response = {
      Menssage: "Etapa asignada con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: "Error al asignar etapa" , mjs: error.message });
  }


});

router.post("/create", async (req, res) => {
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

router.put("/update", async(req,res)=>{
  try {
    await EtapaService.updateEtapa(req);
    const response = {
      Menssage: "Etapa actualizada con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la etapa" , mjs: error.message });
  }
});

module.exports = router;
