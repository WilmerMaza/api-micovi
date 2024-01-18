const {
  PlanUserNames,
  PlanAnual,
  Categoria,
  Macrociclos,
  Microciclos,
  Tareas,
  TareasMicrociclo,
} = require("../../db.js");

const { v1 } = require("uuid");
require("dotenv").config({ path: "../../.env" });

const dataUserPlan_function = async (req, res) => {
  const {
    dataUser: { ID, SportsInstitutionID },
  } = req.user;
  const sportPlan =
    SportsInstitutionID === undefined ? ID : SportsInstitutionID;

  try {
    const dataUserPlan = await PlanUserNames.findOne({
      where: {
        SportsInstitutionID: sportPlan,
        process: "COMPLETED",
        account_status: "VERIFIED",
      },
      order: [["createdAt", "DESC"]],
    });
    if (dataUserPlan) {
      res
        .status(200)
        .send({ dataUserPlan: dataUserPlan, statusPlan: "Plan completado" });
    } else {
      res.status(208).send({
        dataUserPlan: dataUserPlan,
        statusPlan: "No cuenta con un plan",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Ocurrió un error en la base de datos", error });
  }
};

const insertAnnuelPlan = async (req, res) => {
  const {
    dataUser: { ID },
  } = req.user;

  const dataInsert = {
    ...req.body,
    ID: v1(),
    EntrenadorID: ID,
  };

  try {
    await PlanAnual.create(dataInsert);
    res
      .status(200)
      .send({ msg: "Your annual plan has been successfully created" });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "An error occurred while creating the annual plan", error });
  }
};

const getAllAnualPlan = async (req, res) => {
  const { coachId } = req.query;

  try {
    const {
      dataUser: { ID, account },
    } = req.user;

    const data = await PlanAnual.findAll({
      where: { EntrenadorID: account !== "Admin" ? ID : coachId },
      include: {
        model: Categoria,
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send({ item: data });
  } catch (error) {
    res.status(500).send({ msg: "A database error occurred", error });
  }
};

const getPlanById = async (req, res) => {
  try {
    const { documentId } = req.query;
    const data = await PlanAnual.findByPk(documentId, {
      include: {
        model: Categoria,
      },
    });
    res.status(200).send({ item: data });
  } catch (error) {
    res.status(500).send({ msg: "A database error occurred", error });
  }
};

const getAllMacros = async (req, res) => {
  try {
    const { planId } = req.query;

    const data = await Macrociclos.findAll({
      where: { PlanAnualID: planId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({ item: data });
  } catch (error) {
    res.status(500).send({ msg: "A database error occurred", error });
  }
};

const insertMacro = async (req, res) => {
  try {
    const { date_initial, date_end } = req.body;
    const data = await Macrociclos.create({
      ...req.body,
      ID: v1(),
    });

    await insertMicro(date_initial, date_end, data.ID);

    res.status(200).send({
      msg: "Macrociclo y microciclo han sido creados exitosamente.",
    });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Ocurrió un error al crear el macrociclo.", error });
  }
};

const updateMacro = async (req, res) => {
  try {
    const { date_end, date_initial, detail, name, ID } = req.body;
    await Macrociclos.update(
      {
        date_end,
        date_initial,
        name,
        detail,
      },
      {
        where: { ID },
      }
    );
    res
      .status(200)
      .send({ msg: "Macrociclo se ha actualizado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Se produjo un error al actualizar el macrociclo.", error });
  }
};

const getAllMicroCiclo = async (req, res) => {
  try {
    const { documentID } = req.query;
    const data = await Macrociclos.findByPk(documentID, {
      include: { model: Microciclos, order: [["number_micro", "ASC"]] },
    });

    if (data) {
      const response = data.get(); // Obtiene los datos del Macrociclo

      if (response.Microciclos) {
        // Ordena los Microciclos según la columna 'number_micro'
        response.Microciclos = response.Microciclos.sort(
          (a, b) => a.number_micro - b.number_micro
        );
        data.Microciclos = response.Microciclos;
      }
    }
    res.status(200).send({ item: data });
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const insertMicro = async (init, end, ID) => {
  try {
    const dateInit_Macro = new Date(init);
    const dateEnd_Macro = new Date(end);

    let microcycleDuration = 7;
    let dateInit_Micro = new Date(dateInit_Macro);
    let number_micro = 0;

    while (dateInit_Micro <= dateEnd_Macro) {
      number_micro++;
      const dateEnd_Micro = new Date(dateInit_Micro);
      let monthMicro = dateInit_Micro.getMonth();
      let monthMacro = dateEnd_Macro.getMonth();
      let dayMicro = dateInit_Micro.getDate();
      let dayMacro = dateEnd_Macro.getDate();

      if (monthMicro === monthMacro && dayMacro - dayMicro < 7) {
        microcycleDuration =
          dateEnd_Macro.getDate() - dateInit_Micro.getDate() + 1;
      }
      dateEnd_Micro.setDate(dateEnd_Micro.getDate() + microcycleDuration - 1);

      const dataMicro = await Microciclos.create({
        ID: v1(),
        number_micro,
        month: obtenerNombreMes(dateInit_Micro),
        date_initial: dateInit_Micro,
        date_end: dateEnd_Micro,
        number_days: calcularDuracionMicrociclo(dateInit_Micro, dateEnd_Micro),
        MacrocicloID: ID,
      });

      dateInit_Micro.setDate(dateInit_Micro.getDate() + 7);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};

// Función para obtener el nombre del mes a partir de una fecha
function obtenerNombreMes(fecha) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[fecha.getMonth()];
}

async function AssignarEventoFundamental(dateEnd_Macro, dataMicro) {
  const actividad = await actividadFundamental();
  if (actividad) {
    try {
      await TareasMicrociclo.create({
        ID: v1(),
        fechaInicio: dateEnd_Macro,
        fechaFin: dateEnd_Macro,
        MicrocicloID: dataMicro.ID,
        TareaID: actividad.ID,
      });
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("Actividad Competición Fundamental: NO EXISTE");
  }
}

async function actividadFundamental() {
  const actividad = await Tareas.findOne({
    where: { name: "Competición Fundamental" },
  });

  return actividad;
}

// Función para calcular la duración en días entre dos fechas
function calcularDuracionMicrociclo(fechaInicio, fechaFin) {
  const unDia = 24 * 60 * 60 * 1000; // 1 día en milisegundos
  const diferenciaDias = Math.round((fechaFin - fechaInicio) / unDia);
  return diferenciaDias + 1; // Sumar 1 para incluir el día de inicio
}

module.exports = {
  dataUserPlan_function,
  insertAnnuelPlan,
  getAllAnualPlan,
  getPlanById,
  getAllMacros,
  insertMacro,
  updateMacro,
  getAllMicroCiclo,
};
