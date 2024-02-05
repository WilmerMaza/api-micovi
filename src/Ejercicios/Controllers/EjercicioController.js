const { Router } = require("express");
const router = Router();
const {
  getAllexercises,
  getAllSubGrupos,
  getAllGrupos,
  createSubGrupos,
  createExercise,
  getAll_Unitsofmeasurements,
  CombineExercise,
  getGrupo,
  updateSubGrupo,
  assignExercise,
} = require("../Services/exercisesService.js");

router.get("/getAll-exercises", getAllexercises);
router.post("/create-exercise", createExercise);

router.post("/Combine-Exercise", CombineExercise);

router.get("/getAll-SubGrupos", getAllSubGrupos);
router.post("/create-subGrupo", createSubGrupos);
router.put("/update-subgrupo", updateSubGrupo);

router.get("/getAll-Grupos", getAllGrupos);
router.get("/get-Grupo/:idGrupo", getGrupo);

router.get("/getAll-Unitsofmeasurements", getAll_Unitsofmeasurements);

router.post("/assignExercise", async (request, response) => {
  try {
    await assignExercise(request);
    const res = {
      Message: "Asignación realizada con Exito",
    };
    response.status(200).send(res);
  } catch (error) {
    console.error("Error al asignar deportista:", error);
    response.status(500).json({ error: 'Error al asignar deportista', message: error.message });
  }
});

module.exports = router;
