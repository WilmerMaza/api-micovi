const { Router } = require("express");
const router = Router();
const { getAllexercises, getAllSubGrupos } = require("../Services/exercisesService.js");



router.get("/getAll-exercises", getAllexercises);
router.get("/getAll-SubGrupos", getAllSubGrupos);

module.exports = router;
