const { conn } = require("../db.js");
const { v1 } = require('uuid');
const { Ejercicios, SubGrupos, Grupos } = require("../db.js");


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


    

module.exports = {
    getAllexercises
}