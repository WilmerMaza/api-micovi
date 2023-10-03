const { Router } = require("express");
const router = Router();
const { 
    getAllexercises, 
    getAllSubGrupos, 
    getAllGrupos, 
    createSubGrupos,
    createExercise,
    getAll_Unitsofmeasurements
} = require("../Services/exercisesService.js");



router.get("/getAll-exercises", getAllexercises);
router.post("/create-exercise", createExercise);


router.get("/getAll-SubGrupos", getAllSubGrupos);
router.post("/create-subGrupo", createSubGrupos);


router.get("/getAll-Grupos", getAllGrupos);

router.get("/getAll-Unitsofmeasurements", getAll_Unitsofmeasurements)

module.exports = router;
