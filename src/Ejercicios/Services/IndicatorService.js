const { v1 } = require("uuid");
const {
  Indicadores,
  Levels: LevelsDb,
  SportsMan,
  Ejercicios: EjerciciosDb,
  SubGrupos,
  Grupos,
} = require("../../db.js");

const createIndicators = async (req, res) => {
  const {
    name,
    description,
    levelCal,
    absolute,
    levelList,
    exercisesList,
    abrev,
  } = req.body;
  try {
    exercisesList.forEach(async (element) => {
      await Indicadores.create({
        ID: v1(),
        IndicatorsName: name,
        Abbreviation: abrev,
        Description: description,
        AbsolutePercentage: absolute,
        EjercicioID: element,
        CalificationLevel: levelCal,
      })
        .then(async (data) => {
          levelList.forEach(async (item) => {
            await LevelsDb.create({
              ID: v1(),
              LevelName: item.name,
              LevelNumber: item.number,
              Description: item.description,
              IndicadoreID: data.ID,
            });
          });
        })
        .catch((error) => {
          res.send({
            success: false,
            msg: `Error: ${error.message}`,
          });
        });
    });

    res.send({
      success: true,
      msg: "Indicador creado con exito",
    });
  } catch (error) {
    res.send({
      success: false,
      msg: `Error: ${error}`,
    });
  }
};

const getIndicators = async (req, res) => {
  const { id } = req.query;

  try {
    let result = await SportsMan.findByPk(id, {
   
      include: {
        model: EjerciciosDb,
        attributes: [
          "ID",
          "Name",
          "Abbreviation",
          "Relationship",
          "SubGrupoID",
        ],
        include: [
          {
            model: SubGrupos,
            attributes: ["abreviatura", "GrupoID"],
            include: [{ model: Grupos, attributes: ["Abbreviation"] }],
          },
          {
            model: Indicadores,
            attributes: [
              "Abbreviation",
              "AbsolutePercentage",
              "CalificationLevel",
              "Description",
              "EjercicioID",
              "ID",
              "IndicatorsName",
            ],
            include: [
              {
                model: LevelsDb,
                attributes: ["ID", "LevelName", "Description", "IndicadoreID"],
              },
              {
                model: EjerciciosDb,
              },
            ],
          },
        ],
      },
    });

    result = result.toJSON();

    res.json({ item: result });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createIndicators,
  getIndicators,
};
