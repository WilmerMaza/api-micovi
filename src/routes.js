const { Router } = require("express");

const LoginRoutes = require("./Controllers/LoginController.js");
const RegisterRoutes = require("./Controllers/RegisterController.js");
const HomeRoutes = require("./Controllers/HomeController.js");
const RoutesPayment = require("./Controllers/PagoController.js");
const SportManRouter = require("./Controllers/SportManController.js");
const EntrenadorRouter = require("./Controllers/EntrenadorController.js");
const CategoriaRouter = require("./Controllers/CategoriaController.js");


const router = Router();

router.use("/login", LoginRoutes);
router.use("/register", RegisterRoutes);
router.use("/payment", RoutesPayment)
router.use("/home", HomeRoutes);
router.use("/sportMan", SportManRouter);
router.use("/Entrenador", EntrenadorRouter);
router.use("/Categoria", CategoriaRouter);



router.use("*", (req, res) => {
    res.status(404).send({ error: "page not found" });
});

module.exports = router;