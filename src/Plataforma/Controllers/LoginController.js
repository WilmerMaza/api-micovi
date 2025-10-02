const { Router } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

const {
  login_function,
  user_function,
} = require("../Services/LoginService.js");

const router = Router();

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";
// tiempo de vida
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "2d";

router.post("/", async (req, res) => {
  const { Name, Password } = req.body;
  const dataBd = await login_function(Name, Password);

  if (!dataBd) {
    return res.status(401).send("user not found");
  }

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

  // Generar tokens
  const accessToken = jwt.sign({ dataUser }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });

  const refreshToken = jwt.sign({ dataUser }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });

  // Mandar en cookies HttpOnly
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true, // en producción usa HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/auth", // refresco solo bajo /auth
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });

  // Devolver solo info del usuario
  res.json({
    user: dataUser,
  });
});

// Endpoint que requiere autenticación
router.get("/me", (req, res) => {
  const token = req.cookies["access_token"];
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    res.json({ user: payload });
  } catch (e) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
});

// Refrescar token
router.post("/refresh", (req, res) => {
  const token = req.cookies["refresh_token"];
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);

    // Nuevo access
    const newAccess = jwt.sign({ id: payload.id, email: payload.email }, ACCESS_SECRET, { expiresIn: "15m" });

    res.cookie("access_token", newAccess, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.sendStatus(204);
  } catch (e) {
    return res.status(401).json({ message: "Refresh inválido" });
  }
});


module.exports = router;
