const { Router } = require('express');
const jwt = require('jsonwebtoken')
require('dotenv').config({path: '../../.env'});
const { dataUserPlan_function } = require("../Services/HomeService.js")

const { verificationToken } = require("../Utils/validateToken.js");
const { JWT_STRING } = process.env;
const router = Router();

router.post('/', verificationToken, async (req, res) => {
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

router.get('/', verificationToken, dataUserPlan_function)

module.exports = router;