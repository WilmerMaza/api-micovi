const { Router } = require("express");
const router = Router();
const { 
    getAllexercises, 
    getAllSubGrupos, 
    getAllGrupos, 
    createSubGrupos,
    createExercise
} = require("../Services/exercisesService.js");



router.get("/getAll-exercises", getAllexercises);
router.post("/create-exercise", createExercise);


router.get("/getAll-SubGrupos", getAllSubGrupos);
router.post("/create-subGrupo", createSubGrupos);


router.get("/getAll-Grupos", getAllGrupos);


module.exports = router;
