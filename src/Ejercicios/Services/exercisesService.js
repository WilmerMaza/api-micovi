const { v1 } = require("uuid");
const {
  Ejercicios,
  SubGrupos,
  Grupos,
  UnitTypes,
  Unitsofmeasurements,
  Combinacion,
  RelacionCombinados,
  Indicadores,
  SportsMan,
} = require("../../db.js");

const getAllexercises = async (req, resp) => {
  const {
    user: {
      dataUser: { ID },
    },
  } = req;

  try {
    const exercises = await Ejercicios.findAll({
      where: {
        EntrenadorID: ID,
      },
      include: [
        {
          model: SubGrupos,
          include: [{ model: Grupos }],
        },
        {
          model: Indicadores,
        },
      ],
    });

    const exerciseIDs = exercises.map((exercise) => exercise.ID);

    const unitTypes = await UnitTypes.findAll({
      where: {
        EjercicioID: exerciseIDs,
        Type: ["cantidad", "calidad"],
      },
    });

    const unitOfMeasurements = await Unitsofmeasurements.findAll({
      where: {
        ID: unitTypes.map((unitType) => unitType.UnitsofmeasurementID),
      },
      attributes: ["ID", "Name", "Description"],
    });

    const exerciseData = exercises.map((exercise) => {
      const cantidad = unitOfMeasurements.find(
        (unit) =>
          unitTypes.find(
            (unitType) =>
              unitType.EjercicioID === exercise.ID &&
              unitType.Type === "cantidad"
          )?.UnitsofmeasurementID === unit.ID
      );

      const calidad = unitOfMeasurements.find(
        (unit) =>
          unitTypes.find(
            (unitType) =>
              unitType.EjercicioID === exercise.ID &&
              unitType.Type === "calidad"
          )?.UnitsofmeasurementID === unit.ID
      );

      return {
        ...exercise.dataValues,
        Cantidad: cantidad ? cantidad.dataValues : null,
        Calidad: calidad ? calidad.dataValues : null,
        Indicadores: exercise.Indicadores.length,
      };
    });

    resp.send({ item: exerciseData });
  } catch (error) {
    resp.json({ Error: `${error}` });
  }
};

const getAllSubGrupos = async (req, res) => {
  const {
    user: {
      dataUser: { ID },
    },
  } = req;
  try {
    res.send({
      item: await SubGrupos.findAll({ where: { EntrenadorID: ID } }),
    });
  } catch (error) {
    res.json({ Error: `${error}` });
  }
};

const getAllGrupos = async (req, res) => {
  try {
    res.send({ item: await Grupos.findAll() });
  } catch (error) {
    throw new Error(`Error para ingresar a los grupo, Error: ${error}`);
  }
};

const getGrupo = async (req, res) => {
  try {
    const {
      params: { idGrupo },
    } = req;

    res.send({
      item: await Grupos.findOne({
        where: { ID: idGrupo },
      }),
    });
  } catch (error) {
    throw new Error(`Error para ingresar a los grupo, Error: ${error}`);
  }
};

const createSubGrupos = async (req, res) => {
  const {
    dataUser: { ID },
  } = req.user;
  const { NameSubGrupo } = req.body;

  try {
    const subgrupo = await SubGrupos.findOne({
      where: { NameSubGrupo: NameSubGrupo },
    });

    if (!subgrupo) {
      await SubGrupos.create({
        ...req.body,
        ID: v1(),
        EntrenadorID: ID,
      }).then(() => {
        res.send({
          success: true,
          msg: "El subgrupo se ha creado satisfactoriamente",
        });
      });
    } else {
      res.send({
        success: false,
        msg: "El subgrupo ya exite",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      msg: error,
    });
    throw new Error(`Error al insertar el subgrupo, Error: ${error}`);
  }
};

const createExercise = async (req, res) => {
  const {
    dataUser: { ID },
  } = req.user;
  const { UnidTypes } = req.body;
  try {
    await Ejercicios.create({
      ID: v1(),
      ...req.body,
      EntrenadorID: ID,
    }).then((data) => {
      const {
        dataValues: { ID },
      } = data;
      UnidTypes.forEach(async (element) => {
        const { UnitsofmeasurementID, Type } = element;
        await UnitTypes.create({
          ID: v1(),
          EjercicioID: ID,
          UnitsofmeasurementID,
          Type,
        });
      });

      res.send({
        success: true,
        msg: "El ejercicio se ha creado satisfactoriamente",
      });
    });
  } catch (error) {
    res.send({
      success: false,
      msg: error,
    });
    throw new Error(`Error al insertar el ejercicio, Error: ${error}`);
  }
};

const CombineExercise = async (req, res) => {
  const {
    dataUser: { ID },
  } = req.user;
  const { UnidTypes, ListIDExercises } = req.body;

  let EjercicioID = "";
  const EntrenadorID = ID;
  try {
    await Combinacion.create({
      ID: v1(),
      ...req.body,
    }).then(async (data) => {
      const {
        dataValues: { ID },
      } = data;

      await Ejercicios.create({
        ID: v1(),
        ...req.body,
        IsCombined: true,
        IdCombined: ID,
        EntrenadorID,
      })
        .then(async (data) => {
          EjercicioID = data.ID;

          ListIDExercises.forEach(async (item) => {
            const {
              dataValues: { IdCombined },
            } = data;
            await RelacionCombinados.create({
              ID: v1(),
              EjercicioID: item,
              CombinacionID: IdCombined,
            });
          });
        })
        .then(() => {
          UnidTypes.forEach(async (element) => {
            const { UnitsofmeasurementID, Type } = element;
            await UnitTypes.create({
              ID: v1(),
              EjercicioID,
              UnitsofmeasurementID,
              Type,
            });
          });
        });

      res.send({
        success: true,
        msg: "La combinacion se ha creado satisfactoriamente",
      });
    });
  } catch (error) {
    res.send({
      success: false,
      msg: error,
    });
    throw new Error(
      `Error al insertar la conbinacion de ejercicios, Error: ${error}`
    );
  }
};

const getAll_Unitsofmeasurements = async (req, res) => {
  try {
    await Unitsofmeasurements.findAll().then((data) => {
      res.send({ item: data });
    });
  } catch (error) {
    res.json({ msg: error });
  }
};

const updateSubGrupo = async (req, res) => {
  try {
    const { Description, GrupoID, NameSubGrupo, abreviatura, ID } = req.body;

    const [rowsUpdated, [updatedSubGrupo]] = await SubGrupos.update(
      { Description, GrupoID, NameSubGrupo, abreviatura },
      {
        where: { ID },
        returning: true,
      }
    );

    if (rowsUpdated[0] === 0) {
      throw new Error("No se pudo actualizar el subgrupo");
    }

    const response = {
      Menssage: "Subgrupo actualizado con éxito",
    };
    res.status(200).send(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el subgrupo", mjs: error.message });
  }
};

const assignExercise = async (req, res) => {
  const { sportman, exercise } = req.body;

  const promises = [];

  sportman.forEach((itemSport) => {
    exercise.forEach((itemExercise) => {
      const exercisePromise = Ejercicios.findByPk(itemExercise.ID).then(
        (ejercicio) => {
          return SportsMan.findByPk(itemSport.ID).then((sportsMan) => {
            return ejercicio.addSportsMan(sportsMan).then(async () => {
              const rowsUpdated = await SportsMan.update(
                { HasIndicators: true },
                { where: { ID: sportsMan.ID }, returning: true }
              );

              if (rowsUpdated[0] === 0) {
                throw new Error("error update asignacion");
              }
            });
          });
        }
      );

      promises.push(exercisePromise);
    });
  });

  // Esperar a que todas las promesas se resuelvan
  await Promise.all(promises);
};

module.exports = {
  getAllexercises,
  getAllSubGrupos,
  getAllGrupos,
  createSubGrupos,
  createExercise,
  getAll_Unitsofmeasurements,
  CombineExercise,
  getGrupo,
  updateSubGrupo,
  assignExercise,
};
