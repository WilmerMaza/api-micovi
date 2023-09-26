const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

const verificationToken = (req, res, next) => {
  const { JWT_STRING } = process.env;
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado" });
  }

  const tokenBeare = token.split(" ")[1];

  try {
    const decoded = jwt.verify(tokenBeare, JWT_STRING);
    const tokenExpiryTimestamp = decoded.exp * 1000;
    if (Date.now() > tokenExpiryTimestamp) {
      return res.status(403).json({ mensaje: "Token inválido (caducado)" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};

module.exports = { verificationToken };
