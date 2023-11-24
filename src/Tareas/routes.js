const express = require('express');
const router = express.Router();
const TareasController = require("./Controllers/TareasController");
const TareasxMicroController = require("./Controllers/TareasxMicroController");

//tareas
router.post("/create",TareasController.crearTareas);
router.get("/getTareas",TareasController.getTareas);
router.delete("/delete/:idTarea",TareasController.deleteTareas);
//Asignar Tareas Microciclos

router.post("/assignTasks",TareasxMicroController.assignTask)
router.get("/getMicrocicloTask:microciclo",TareasxMicroController.getMicrocicloTask)

module.exports = router;