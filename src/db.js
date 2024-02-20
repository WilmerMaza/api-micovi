require("dotenv").config({ path: "./.env" });
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  AMBIENTE_API,
  DATABASE_NAME,
  DATABASE_PORT,
} = process.env;

const sequelize =
  AMBIENTE_API === "PRODUCCION"
    ? new Sequelize({
        database: DATABASE_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: DATABASE_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
        {
          logging: false, // set to console.log to see the raw SQL queries
          native: false, // lets Sequelize know we can use pg-native for ~30% more speed
        }
      );
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  SportsInstitutions,
  RollSettings,
  TableLogins,
  PlanUserNames,
  Entrenador,
  HistorialCategorico,
  Categoria,
  SportsMan,
  PlanAnual,
  Macrociclos,
  Microciclos,
  Ejercicios,
  SubGrupos,
  Grupos,
  Indicadores,
  Levels,
  UnitTypes,
  Unitsofmeasurements,
  Patterns,
  TareasMicrociclo,
  Tareas,
  Etapa,
  Diciplinas,
  Calificacion
} = sequelize.models;

// Aca vendrian las relaciones
SportsInstitutions.hasOne(RollSettings);
RollSettings.belongsTo(SportsInstitutions);

RollSettings.hasOne(TableLogins);
TableLogins.belongsTo(RollSettings);

SportsInstitutions.hasMany(PlanUserNames);
PlanUserNames.belongsTo(SportsInstitutions);

SportsInstitutions.hasMany(Entrenador);
Entrenador.belongsTo(SportsInstitutions);

SportsInstitutions.hasMany(Categoria);
Categoria.belongsTo(SportsInstitutions);

Categoria.hasMany(HistorialCategorico);
HistorialCategorico.belongsTo(Categoria);

SportsMan.hasMany(HistorialCategorico);
HistorialCategorico.belongsTo(SportsMan);

SportsInstitutions.hasMany(SportsMan);
SportsMan.belongsTo(SportsInstitutions);

Entrenador.hasMany(PlanAnual);
PlanAnual.belongsTo(Entrenador);

Categoria.hasMany(PlanAnual);
PlanAnual.belongsTo(Categoria);

PlanAnual.hasMany(Macrociclos);
Macrociclos.belongsTo(PlanAnual);

Macrociclos.hasMany(Microciclos);
Microciclos.belongsTo(Macrociclos);

Ejercicios.hasMany(Patterns);
Patterns.belongsTo(Ejercicios);

SportsMan.hasMany(Patterns);
Patterns.belongsTo(SportsMan);

Grupos.hasMany(SubGrupos);
SubGrupos.belongsTo(Grupos);

SubGrupos.hasMany(Ejercicios);
Ejercicios.belongsTo(SubGrupos);

Levels.belongsTo(Indicadores);
Indicadores.hasMany(Levels);

Indicadores.belongsTo(Ejercicios);
Ejercicios.hasMany(Indicadores);

Ejercicios.belongsToMany(Unitsofmeasurements, { through: UnitTypes });
Unitsofmeasurements.belongsToMany(Ejercicios, { through: UnitTypes });

Entrenador.hasMany(Ejercicios);
Ejercicios.belongsTo(Entrenador);

Entrenador.hasMany(SubGrupos);
SubGrupos.belongsTo(Entrenador);

Microciclos.hasMany(TareasMicrociclo);
TareasMicrociclo.belongsTo(Microciclos);

Tareas.hasMany(TareasMicrociclo);
TareasMicrociclo.belongsTo(Tareas);

Entrenador.hasMany(Tareas);
Tareas.belongsTo(Entrenador);

Entrenador.hasMany(Etapa);
Etapa.belongsTo(Entrenador);

Etapa.hasMany(Microciclos);
Microciclos.belongsTo(Etapa);

SportsInstitutions.hasMany(Diciplinas);
Diciplinas.belongsTo(SportsInstitutions);

Diciplinas.hasMany(SportsMan);
SportsMan.belongsTo(Diciplinas);

Diciplinas.hasMany(PlanAnual);
PlanAnual.belongsTo(Diciplinas);

Ejercicios.belongsToMany(SportsMan, { through: "SportmanExercies" });
SportsMan.belongsToMany(Ejercicios, { through: "SportmanExercies" });

Calificacion.belongsTo(SportsMan);
SportsMan.hasMany(Calificacion);

Calificacion.belongsTo(Ejercicios);
Ejercicios.hasMany(Calificacion)

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
