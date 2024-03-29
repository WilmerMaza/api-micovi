const { Router } = require("express");
const router = Router();
const CategoriaService = require("../Services/CategoriaService.js");
const { verificationToken } = require("../../Utils/validateToken.js");

router.get("/getAll", verificationToken, async (req, res) => {
  try {
    const Categoria = await CategoriaService.getAllCategoria(req);
    res.json(Categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});

router.delete("/delete/:idCategoria", verificationToken, async (req, res) => {
  try {
    await CategoriaService.deleteCategoria(req);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: "Error al Eliminar el Registro" });
  }
});

router.post("/create",verificationToken, async (req, res) => {
  try {
    await CategoriaService.createCategoria(req);
    const response = {
      Menssage: "Categoria creada con éxito",
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
    const Categoria = await CategoriaService.updateCategoria(req);
    if (Categoria) {
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


router.post("/getAllByCoach", verificationToken, async (req, res) => {
  try {
    const Categoria = await CategoriaService.getAllCategoriaByCoach(req);
    res.json(Categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});

router.put("/update-category", async(req,res)=>{
  try {
    await CategoriaService.updateCategory(req);
    const response = {
      Menssage: "Categoria actualizada con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la categoria" , mjs: error.message });
  }
});

module.exports = router;
