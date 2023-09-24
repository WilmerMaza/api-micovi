const { Router } = require("express");
const router = Router();
const { getAllexercises } = require("../Services/exercisesService.js")



router.get("/getAll-exercises", getAllexercises)


module.exports = router;
