const { PlanUserNames, PlanAnual, Categoria } = require("../db.js");
const { v1 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../.env'});
const { JWT_STRING } = process.env;

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
    jwt.verify(await req.token, JWT_STRING, async (error, authData) => {
        if(error){
            res.sendStatus(401);
        }else {
            try {
                const { dataUser : {ID}} = authData;
                const data = await PlanAnual.findAll({
                    where: {EntrenadorID: ID},
                    include:{
                        model: Categoria
                    }
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

module.exports = {
    dataUserPlan_function, 
    insertAnnuelPlan,
    getAllAnualPlan,
    getPlanById
}