const { PlanUserNames, PlanAnual, Categoria, Macrociclos, Microciclos } = require("../../db.js");
const { v1 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../.env'});
const { JWT_STRING } = process.env;
const { Op } = require("sequelize");

const dataUserPlan_function = async (req, res) => {
    const { dataUser: { ID, SportsInstitutionID } } = req.user;
    const sportPlan = SportsInstitutionID === undefined ? ID : SportsInstitutionID;

    try {
        const dataUserPlan = await PlanUserNames.findOne({
            where: {
                SportsInstitutionID: sportPlan,
                process: 'COMPLETED',
                account_status: 'VERIFIED'
            },
            order: [['createdAt', 'DESC']] 
        });
        if (dataUserPlan) {
            res.status(200).send({dataUserPlan: dataUserPlan,
                                  statusPlan: 'Plan completado'});
        }
        else{
            res.status(208).send({dataUserPlan: dataUserPlan,
                                statusPlan: 'No cuenta con un plan'});
        }
    } catch (error) {
        res.status(500).send({ msg: "Ocurrió un error en la base de datos", error });
    }
};


const insertAnnuelPlan = async (req, res) => {
    jwt.verify(await req.token, JWT_STRING, async (error, authData) => {
        if(error){
            res.sendStatus(401);
        }else {
            const dataInsert = {
                ...req.body,
                ID : v1(),
                EntrenadorID: authData.dataUser.ID,
            }

            try {
                await PlanAnual.create(dataInsert);
                res.status(200).send({msg: 'Your annual plan has been successfully created'})
            } catch (error) {
                res.status(500).send({msg: 'An error occurred while creating the annual plan', error})
            }
        }
    })
}


const getAllAnualPlan = async (req, res) => {
    const { coachId } = req.query;
    jwt.verify(await req.token, JWT_STRING, async (error, authData) => {
        if(error){
            res.sendStatus(401);
        }else {
            try {
                const { dataUser : {ID, account}} = authData;
                const data = await PlanAnual.findAll({
                    where: {EntrenadorID: account !== 'Admin' ? ID : coachId},
                    include:{
                        model: Categoria
                    },
                    order:[['createdAt', 'DESC']]
                });
                res.status(200).send({item: data})
            } catch (error) {
                res.status(500).send({msg: 'A database error occurred', error})
            }
        }
    })
}

const getPlanById = async (req, res) => {
    try {
        const { documentId } = req.query;
        const data = await PlanAnual.findByPk(documentId,{
            include:{
                model: Categoria
            }
        });
        res.status(200).send({item: data})
    } catch (error) {
        res.status(500).send({msg: 'A database error occurred', error})
    }
}

const getAllMacros = async (req, res) => {
    try {
        const { planId } = req.query;

        const data = await Macrociclos.findAll({
            where: {PlanAnualID : planId},
            order:[['createdAt', 'DESC']]
        });

        res.status(200).send({item: data});
    }
    catch (error) {
        res.status(500).send({msg: 'A database error occurred', error})
    }
}

const insertMacro = async (req, res) => {
    try {
        const { date_initial, date_end } = req.body;
        const data = await Macrociclos.create({
            ...req.body,
            ID : v1()
        });

        await insertMicro(date_initial,date_end, data.ID);

        res.status(200).send({msg: 'Your macrocycle and microcycle have been successfully created'})
    } catch (error) {
        res.status(500).send({msg: 'An error occurred while creating the macrocycle', error})
    }
}

const updateMacro = async (req, res) => {
    try {
        const { date_end, date_initial, detail, name, ID } = req.body;
        await Macrociclos.update({
            date_end,
            date_initial,
            name,
            detail
        },
        {
            where: {ID}
        }
        );
        res.status(200).send({msg: 'Your macrocycle has been successfully updated'})
    } catch (error) {
        res.status(500).send({msg: 'An error occurred while updating the macrocycle', error})
    }
}

const getAllMicroCiclo = async (req, res) => {
    try {
        const { documentID } = req.query;
      const data = await Macrociclos.findByPk(documentID,{
            include: { model: Microciclos}
        })
        res.status(200).send({item: data})
    } catch (error) {
        throw new Error(`${error}`)
    }
}

const insertMicro = async (init, end, ID) => {
    try {
        const dateInit_Macro = new Date(init);
        const dateEnd_Macro = new Date(end);
    
        let microcycleDuration = 7;
        let dateInit_Micro = new Date(dateInit_Macro);
        let number_micro = 0;
    
        while(dateInit_Micro <= dateEnd_Macro) {
            number_micro++
            const dateEnd_Micro = new Date(dateInit_Micro);
            let monthMicro = dateInit_Micro.getMonth();
            let monthMacro = dateEnd_Macro.getMonth();
            let dayMicro = dateInit_Micro.getDate();
            let dayMacro = dateEnd_Macro.getDate();

            if ((monthMicro === monthMacro) && ( dayMacro - dayMicro < 7)) {
                microcycleDuration = dateEnd_Macro.getDate() - dateInit_Micro.getDate() + 1;
            }
            dateEnd_Micro.setDate(dateEnd_Micro.getDate() + microcycleDuration - 1);
    
            await Microciclos.create({
                ID: v1(),
                number_micro,
                month: obtenerNombreMes(dateInit_Micro),
                date_initial: dateInit_Micro,
                date_end: dateEnd_Micro,
                number_days: calcularDuracionMicrociclo(dateInit_Micro, dateEnd_Micro),
                MacrocicloID: ID
            })
    
            dateInit_Micro.setDate(dateInit_Micro.getDate() + 7);
        }

    } catch (error) {
        throw new Error(`${error}`)
    }

}

// Función para obtener el nombre del mes a partir de una fecha
function obtenerNombreMes(fecha) {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[fecha.getMonth()];
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
    getAllMicroCiclo
}