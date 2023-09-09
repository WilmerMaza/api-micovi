const { Router } = require('express');
const jwt = require('jsonwebtoken')
require('dotenv').config({path: '../../.env'});
const { 
    dataUserPlan_function, 
    insertAnnuelPlan, 
    getAllAnualPlan, 
    getPlanById, 
    getAllMacros, 
    insertMacro,
    updateMacro,
    getAllMicroCiclo
} = require("../Services/HomeService.js")

const { JWT_STRING } = process.env;
const router = Router();

router.post('/', async (req, res) => {
    jwt.verify(await req.token, JWT_STRING, (error, authData) => {
        if(error){
            res.sendStatus(401);
        }else {
            res.json({
                message: "Bienvenido a tu App MiCovid",
                authData
            });
        }
    })
});

router.get('/', dataUserPlan_function);

//insert annual plan
router.post('/annualPlan', insertAnnuelPlan);

//get all annual plan
router.get('/getAllAnnualPlan', getAllAnualPlan);

//get one annual plan by id
router.get("/getAnnualPlanById", getPlanById);

//get all macrociclos by FK
router.get("/getAllMacrociclos", getAllMacros);

//insert macrociclo
router.post("/postInsertMacro", insertMacro);

//updating macrocycle
router.post("/updateMacrocycle", updateMacro);

router.get("/getAllMicro", getAllMicroCiclo);

module.exports = router;