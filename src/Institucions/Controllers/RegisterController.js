const { Router } = require('express');
const { register_function } = require("../Services/RegisterService.js")
const { conn } = require("../../db.js")

const router = Router();

router.post('/', async (req, res) => {
    const dataFull = {...req.body}
    try {
      const dataUser =  await register_function(dataFull);
        const response = {
            isRegister : true,
            dataUser,
            msg: 'was created your activity succesfully',
            error: ''
        }
        res.status(200).send(response)
    }
    catch (error) {
        const response = {
            isRegister : false,
            msg: 'We have detected an error when registering',
            error: error
        }
        res.status(400).send(response)
    }
})

router.get('/planes', async (req, resp) => {
    try {
        const result = await conn.query("SELECT * FROM planes where planname <> 'PRUEBAS GRATIS'"); // Utiliza la conn directamente
        resp.status(200).json(result[1].rows);
    } catch (error) {
        resp.status(400).send({ msg: `error in the database when trying to bring the plans, ${error}`});
    }
});


module.exports = router;