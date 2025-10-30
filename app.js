// app.js / index.js
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "./.env" });

const routes = require("./src/routes.js");
const { conn } = require("./src/db.js");

const server = express();
server.name = "API";

// --- Config base ---
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ✅ lee orígenes permitidos del .env
// Ejemplo .env:
// CORS_ORIGIN=http://localhost:4200,https://micovisport.site,https://api.micovisport.site
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : [];

console.log("🔐 Allowed CORS origins:", allowedOrigins);
console.log("🌍 NODE_ENV:", NODE_ENV);

// --- Middlewares globales ---
server.use(morgan("dev"));
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json());
server.use(cookieParser());

// --- CORS ---
// Nota clave: el navegador hace primero OPTIONS (preflight).
// Si ese OPTIONS no devuelve los headers CORS correctos, pum error.
// Esta config maneja eso para cualquier ruta.
const corsOptions = {
  origin: function (origin, callback) {
    // 1. Requests sin origen (curl, Postman, healthchecks internos, etc.)
    if (!origin) {
      console.log("➡️  Sin Origin (probable Postman/cURL), permitido");
      return callback(null, true);
    }

    // 2. Navegador: validar contra whitelist
    if (allowedOrigins.includes(origin)) {
      console.log("✅ CORS permitido para:", origin);
      return callback(null, true);
    }

    // 3. Bloqueado
    console.warn(
      "⛔ CORS bloqueado para:",
      origin,
      "|| allowed:",
      allowedOrigins
    );
    return callback(new Error("CORS no permitido"));
  },

  credentials: true, // permite cookies / Authorization
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-XSRF-TOKEN",
    "Accept",
    "x-access-token",
    "x-api-key",
  ],
  exposedHeaders: ["Content-Type", "Authorization"],
};

// 👉 Log de cada request (útil para debug mientras montas todo)
server.use((req, res, next) => {
  console.log(
    `🌐 ${req.method} ${req.originalUrl} from ${
      req.headers.origin || "no-origin"
    }`
  );
  next();
});

// aplica CORS a TODO
server.use(cors(corsOptions));

// maneja preflight OPTIONS globalmente
server.options("*", cors(corsOptions), (req, res) => {
  // devolvemos 200 para que el navegador siga con el POST real
  res.sendStatus(200);
});

// --- Archivos estáticos públicos (solo si usas /src/public) ---
server.use(express.static(path.join(__dirname, "/src/public")));

// --- Rutas principales de la API ---
server.use("/", routes);

// --- Manejo centralizado de errores ---
// IMPORTANTE: este middleware captura también el error lanzado
// en corsOptions (por ejemplo "CORS no permitido")
// y responde algo que el navegador pueda entender sin tumbar el server.
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;

  // Si el error viene de CORS, respondemos 403 explícito
  if (message === "CORS no permitido") {
    console.error("🚫 Bloqueado por CORS:", req.headers.origin);
    return res.status(403).json({
      error: "CORS bloqueado",
      origin: req.headers.origin || null,
      allowed: allowedOrigins,
    });
  }

  console.error("🔥 ERROR:", message);
  res.status(status).send(message);
});

// --- Levantar servidor ---
server.listen(PORT, async () => {
  console.log("=======================================");
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🏷  Mode: ${NODE_ENV}`);
  console.log("🔐 Allowed origins:", allowedOrigins);
  console.log("=======================================");

  // Síncrono con alter:true en prod puede ser caro,
  // pero lo dejo igual porque ya lo tenías así.
  try {
    await conn.sync({ alter: true });
    console.log("📦 DB sync OK");
  } catch (dbErr) {
    console.error("💥 DB sync error:", dbErr.message);
  }
});

module.exports = server;
