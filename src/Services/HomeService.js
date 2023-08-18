const { PlanUserNames } = require("../db.js")

const dataUserPlan_function = async (req, res) => {
        const { dataUser:{ID,SportsInstitutionID }} = req.user;
        const sportPlan = SportsInstitutionID === undefined?ID:SportsInstitutionID;
    try {
        const dataUserPlan = await PlanUserNames.findOne({
            where: {SportsInstitutionID : sportPlan}
        })
        
        res.status(200).send(dataUserPlan)
    } catch (error) {
        res.status(404).send({msg: "an error has occurred in the database"}, error)
    }

}


module.exports = {dataUserPlan_function}