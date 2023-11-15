const { v1 } = require('uuid');
const { Indicadores, Levels, Ejercicios } = require("../../db.js");

const createIndicators = async (req, res) => {
    const { name, description, levelCal, absolute, sportman, levelList, exercisesList, abrev } = req.body;
    try {
        exercisesList.forEach( async (element) => {
            await Indicadores.create({
                ID: v1(),
                IndicatorsName: name,
                Abbreviation: abrev,
                Description: description,
                AbsolutePercentage: absolute,
                EjercicioID: element,
                SportsManID: sportman,
                CalificationLevel: levelCal
            })
            .then(async (data) => {
                levelList.forEach(async(item) => {
                    await Levels.create({
                        ID: v1(),
                        LevelName: item.name,
                        LevelNumber: item.number,
                        Description: item.description,
                        IndicadoreID: data.ID
                    })
                });

                const rowsUpdated = await Ejercicios.update(
                {HasIndicators : true},
                { where: {ID: data.EjercicioID},
                returning: true})

                if (rowsUpdated[0] === 0){
                    throw new Error("error update");
                }
            })
            .catch((error) => {
                res.send ({
                    success: false,
                    msg: `Error: ${error.message}`
                })
            })
        });

        res.send({
            success: true,
            msg: "Indicador creado con exito"
        })

    } catch (error) {
        res.send ({
            success: false,
            msg: `Error: ${error}`
        })
    }
}


module.exports = {
    createIndicators
}