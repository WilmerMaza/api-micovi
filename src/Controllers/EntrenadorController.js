const { Router } = require("express");
const router = Router();
const EntrenadorService = require("../Services/EntrenadorService.js")
const { verificationToken } = require("../Utils/validateToken.js")

router.get("/getAll",verificationToken, async (req, res) => {
  const {dataUser:{ID}} = req.user;
  try {
    const Entrenador = await EntrenadorService.getAllEntrenador(ID);
    res.json(Entrenador);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});

router.post('/create', async (req, res) => {
  try {
    const sportsMan = await EntrenadorService.createEntrenador(req);
    const response = {
          Entrenador: sportsMan,
          Menssage : "Registro Exitoso"
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro' ,mjs:error});
  }
});

// router.get("/get",verificationToken, async (req, res) => {
//   try {
//     const sportsMan = await sportsManService.getSportsMan(
//       req.body.identification
//     );
//     if (sportsMan) {
//       res.json(sportsMan);
//     } else {
//       res.status(404).json({ message: "deportista no encontrado" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error al obtener el registro" });
//   }
// });

module.exports = router;
