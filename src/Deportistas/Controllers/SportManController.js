const { Router } = require('express');
const router = Router();
const sportsManService = require('../Services/SportManService.js');
const { verificationToken } = require("../../Utils/validateToken.js");

router.post('/update', verificationToken, async (req, res) => {
  try {
    const updatedSportsMan = await sportsManService.updateSportsMan(req);
    if (updatedSportsMan) {
      const response = {
        Message: "Registro Actualizado Exitosamente",
      };
      res.status(200).send(response);
    } else {
      res.status(404).json({ message: 'Deportista no encontrado' });
    }
  } catch (error) {
    console.error("Error al actualizar el deportista:", error);
    res.status(500).json({ error: 'Error al actualizar el deportista', message: error.message });
  }
});

router.post('/delete', verificationToken, async (req, res) => {
  try {
    const result = await sportsManService.deleteSportsMan(req.body.ID);
    if (result) {
      res.status(204).json({ message: 'Deportista eliminado con éxito' });
    } else {
      res.status(404).json({ message: 'Deportista no encontrado' });
    }
  } catch (error) {
    console.error("Error al eliminar el deportista:", error);
    res.status(500).json({ error: 'Error al eliminar el deportista', message: error.message });
  }
});

router.post('/create', verificationToken, async (req, res) => {
  try {
  await sportsManService.createSportsMan(req);
    const response = {
      Message: "Deportista creado con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    console.error("Error al crear el deportista:", error);
    res.status(500).json({ error: 'Error al crear el deportista', message: error.message });
  }
});

router.get('/getAll', verificationToken, async (req, res) => {
  try {
    const sportsMen = await sportsManService.getAllSportsMen(req);
    res.json(sportsMen);
  } catch (error) {
    console.error("Error al obtener los deportistas:", error);
    res.status(500).json({ error: 'Error al obtener los deportistas', message: error.message });
  }
});

router.post('/get', verificationToken, async (req, res) => {
  try {

    const sportsMen = await sportsManService.getSportsMenWithFilters(req);
    if (sportsMen.length > 0) {
      res.json(sportsMen);
    } else {
      res.status(404).json({ message: 'Deportistas no encontrados' });
    }
  } catch (error) {
    console.error("Error al obtener los deportistas:", error);
    res.status(500).json({ error: 'Error al obtener los deportistas', message: error.message });
  }
});

router.post('/getHistorialCategory', verificationToken, async (req, res) => {
  try {
    const filters = req; 
    const historialSportman = await sportsManService.getHistorialCategory(filters);
    if (historialSportman.length > 0) {
      res.json(historialSportman);
    } else {
      res.status(404).json({ message: 'Historial de deportistas no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener el historial de deportistas:", error);
    res.status(500).json({ error: 'Error al obtener el historial de deportistas', message: error.message });
  }
});

router.post('/calificacion', verificationToken, async (req, res) => {
  try {
    await sportsManService.insertar_calificacion(req.body);
    res.status(200).json({ Message: 'El Deportista fue calificado con exito' });

  } catch (error) {
    console.error("Error al calificar al deportista:", error);
    res.status(500).json({ error: 'Error al calificar al deportista', Message: error.message });
  }
});

router.get('/calificacion', verificationToken, async (req, res) => {
  try {
    const response = await sportsManService.get_calificacion(req);
    res.json(response)
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    res.status(500).json({ error: 'Error al obtener las calificaciones', Message: error.message });
  }
})

module.exports = router;
