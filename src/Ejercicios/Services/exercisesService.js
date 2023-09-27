const { conn } = require("../../db.js");
const { v1 } = require('uuid');
const { Ejercicios, SubGrupos, Grupos } = require("../../db.js");


const getAllexercises = async (req, resp) => {
        const { coachId } = req.query;

        try {
            const data = await Ejercicios.findAll({
                where: {
                    EntrenadorID: coachId
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
    const { coachId } = req.query;
    try {
        res.send({item: await SubGrupos.findAll({where:{EntrenadorID: coachId}})})
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

    try {
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

    } catch (error) {
        res.send({
            success: false,
            msg: error
        })
        throw new Error(`Error al insertar el subgrupo, Error: ${error}`);
    }
}
    

module.exports = {
    getAllexercises,
    getAllSubGrupos,
    getAllGrupos,
    createSubGrupos
}