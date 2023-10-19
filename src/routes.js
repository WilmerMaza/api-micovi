const { Router } = require("express");
const { verificationToken } = require("./Utils/validateToken.js");

const LoginRoutes = require("./Plataforma/Controllers/LoginController.js");
const RegisterRoutes = require("./Institucions/Controllers/RegisterController.js");
const HomeRoutes = require("./Plataforma/Controllers/HomeController.js");
const RoutesPayment = require("./Paypal/Controllers/PagoController.js");
const SportManRouter = require("./Deportistas/Controllers/SportManController.js");
const EntrenadorRouter = require("./Entrenadores/Controllers/EntrenadorController.js");
const CategoriaRouter = require("./Categorias/Controllers/CategoriaController.js");
const EjercicioRouter = require("./Ejercicios/Controllers/EjercicioController.js");
const TareasRouter = require("./Tareas/routes.js");
const subirImagenRoutes = require("./subirImagen/controllers/subirController.js");
const router = Router();

router.use("/login", LoginRoutes);
router.use("/register", RegisterRoutes);
router.use("/payment", RoutesPayment);
router.use("/home", verificationToken, HomeRoutes);
router.use("/sportMan", SportManRouter);
router.use("/Entrenador", EntrenadorRouter);
router.use("/Categoria", CategoriaRouter);
router.use("/exercises", verificationToken, EjercicioRouter);
router.use("/Tareas", verificationToken, TareasRouter);
router.use("/subirImagen", verificationToken, subirImagenRoutes);

router.use("*", (req, res) => {
  res.status(404).send({ error: "page not found" });
});

module.exports = router;
