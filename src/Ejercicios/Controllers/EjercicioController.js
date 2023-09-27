const { Router } = require("express");
const router = Router();
const { 
    getAllexercises, 
    getAllSubGrupos, 
    getAllGrupos, 
    createSubGrupos 
} = require("../Services/exercisesService.js");



router.get("/getAll-exercises", getAllexercises);
router.get("/getAll-SubGrupos", getAllSubGrupos);


router.get("/getAll-Grupos", getAllGrupos);
router.post("/create-subGrupo", createSubGrupos)


module.exports = router;
