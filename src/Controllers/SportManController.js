const { Router } = require('express');
const router = Router();
const sportsManService = require('../Services/SportManService.js');

router.post('/update', async (req, res) => {
  try {
    const updatedSportsMan = await sportsManService.updateSportsMan(req.body);
    if (updatedSportsMan) {
      res.json(updatedSportsMan);
    } else {
      res.status(404).json({ message: 'deportista no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const result = await sportsManService.deleteSportsMan(req.body.ID);
    if (result) {
      res.status(204).json({ message: 'deportista eliminado con éxito' });
    } else {
      res.status(404).json({ message: 'deportista no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const sportsMan = await sportsManService.createSportsMan(req.body);
    res.status(201).json(sportsMan);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro' });
  }
});

router.get('/getAll', async (req, res) => {
  try {
    const sportsMen = await sportsManService.getAllSportsMen();
    res.json(sportsMen);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

router.post('/get', async (req, res) => {
  try {
    const filters = req.body; // Obtener los filtros de la query string
    const sportsMen = await sportsManService.getSportsMenWithFilters(filters);
    if (sportsMen.length > 0) {
      res.json(sportsMen);
    } else {
      res.status(404).json({ message: 'Deportistas no encontrados' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

module.exports = router;