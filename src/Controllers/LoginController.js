const { Router } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

const {
  login_function,
  user_function,
} = require("../Services/LoginService.js");

const { JWT_STRING, JWT_EXPIRED } = process.env;
const router = Router();
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.post("/", async (req, res) => {
  const { Name, Password } = req.body;
  const dataBd = await login_function(Name, Password);
  if (dataBd) {
    let dataUser;
    const {
      RollSetting: { account },
    } = dataBd.dataValues;

    if (account !== "Admin") {
      const {
        RollSetting: { usuario },
      } = dataBd.dataValues;

      dataUser = await user_function(usuario);
      dataUser.dataValues["account"] = account;
    } else {
      const {
        RollSetting: {
          SportsInstitution: { dataValues },
        },
      } = dataBd.dataValues;

      dataUser = dataValues;
      dataUser["account"] = account;
    }

    jwt.sign(
      { dataUser },
      JWT_STRING,
      { expiresIn: JWT_EXPIRED },
      (error, token) => {
        res.json({
          token
        });
      }
    );
  } else {
    res.status(401).send("user not found");
  }
});

module.exports = router;
