const { Router } = require("express");
const { verificationToken } = require("./Utils/validateToken.js");

const LoginRoutes = require("./Controllers/LoginController.js");
const RegisterRoutes = require("./Controllers/RegisterController.js");
const HomeRoutes = require("./Controllers/HomeController.js");
const RoutesPayment = require("./Controllers/PagoController.js");
const SportManRouter = require("./Controllers/SportManController.js");
const EntrenadorRouter = require("./Controllers/EntrenadorController.js");
const CategoriaRouter = require("./Controllers/CategoriaController.js");
const EjercicioRouter = require("./Controllers/EjercicioController.js");

const router = Router();

router.use("/login", LoginRoutes);
router.use("/register", RegisterRoutes);
router.use("/payment", RoutesPayment);
router.use("/home", verificationToken, HomeRoutes);
router.use("/sportMan", SportManRouter);
router.use("/Entrenador", EntrenadorRouter);
router.use("/Categoria", CategoriaRouter);
router.use("/exercises", EjercicioRouter)


router.use("*", (req, res) => {
    res.status(404).send({ error: "page not found" });
});

module.exports = router;