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

const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:4200";
const isProd = process.env.NODE_ENV === "production";

// ---- Middlewares base
server.use(morgan("dev"));
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json());
server.use(cookieParser());

// ---- CORS correctamente configurado para credenciales
server.use(
  cors({
    origin: ORIGIN, // 👈 origen exacto, no '*'
    credentials: true, // 👈 permite cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-XSRF-TOKEN", "Authorization"],
  })
);

// (Opcional) responder preflight explícitamente (cors lo maneja, pero por claridad)
server.options(
  "*",
  cors({
    origin: ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-XSRF-TOKEN", "Authorization"],
  })
);

// ---- Archivos estáticos (si aplica)
server.use(express.static(path.join(__dirname, "/src/public")));

// ❌ IMPORTANTE: elimina el middleware viejo que ponía ACAO: * (rompe credenciales)
// server.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   ...
// });

// ---- Rutas
server.use("/", routes);

// ---- Manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

const {
  env: { PORT },
} = process;
server.listen(PORT || 3002, () => {
  console.log(
    `Server listening on port ${PORT ?? 3002}! (CORS origin: ${ORIGIN})`
  );
  conn.sync({ alter: true });
});

module.exports = server;
