const { conn } = require("../../db.js");
const { v1 } = require('uuid');
const { Ejercicios, SubGrupos, Grupos, UnitTypes } = require("../../db.js");


const getAllexercises = async (req, resp) => {
        const {
            user: {
              dataUser:{ID },
            },
          } = req;

    
        try {
            const data = await Ejercicios.findAll({
                where: {
                    EntrenadorID: ID
                },
                include:[{
                    model: SubGrupos,
                    include:[{model: Grupos}]
                }]
            })

            resp.send({item: data})
        } catch (error) {
            resp.json({Error:`${error}`})
        }
}

const getAllSubGrupos = async (req, res) => {
    const {
        user: {
          dataUser:{ID },
        },
      } = req;
    try {
        res.send({item: await SubGrupos.findAll({where:{EntrenadorID: ID}})})
    } catch (error) {
        res.json({Error:`${error}`})
    }
}

const getAllGrupos = async (req, res) => {
    try {
        res.send({item: await Grupos.findAll()})
    } catch (error) {
        throw new Error(`Error para ingresar a los grupo, Error: ${error}`)
    }
}

const createSubGrupos = async (req, res) => {
    const { dataUser: { ID }} = req.user;
    const { NameSubGrupo } =req.body

    try {
        const subgrupo = await SubGrupos.findOne({
        where: { NameSubGrupo: NameSubGrupo }
        });

        if(!subgrupo )
        {
        await SubGrupos.create({
            ...req.body,
            ID: v1(),
            EntrenadorID: ID
        }).then(()=> {
            res.send({
                success: true,
                msg: "El subgrupo se ha creado satisfactoriamente"
            })
        })
        }
    else
    {
        res.send ({
            success: false,
            msg: "El subgrupo ya exite"
        })
    }

    } catch (error) {
        res.send({
            success: false,
            msg: error
        })
        throw new Error(`Error al insertar el subgrupo, Error: ${error}`);
    }
}

const createExercise = async (req, res) => {
    const { dataUser: { ID }} = req.user;
    const { UnidTypes } = req.body;
    try {
        await Ejercicios.create({
            ID: v1(),
            ...req.body,
            EntrenadorID: ID
        })
        .then((data) => {
                const { dataValues: { ID }} = data;
                UnidTypes.forEach(async(element) => {
                    const { UnitsofmeasurementID, Type} = element;
                    await UnitTypes.create({
                        ID: v1(),
                        EjercicioID: ID,
                        UnitsofmeasurementID,
                        Type
                    })
                });

            res.send({
                success: true,
                msg: "El ejercicio se ha creado satisfactoriamente"
            })
        })
    } catch (error) {
        res.send({
            success: false,
            msg: error
        })
        throw new Error(`Error al insertar el ejercicio, Error: ${error}`);
    }
}
    

module.exports = {
    getAllexercises,
    getAllSubGrupos,
    getAllGrupos,
    createSubGrupos,
    createExercise
}