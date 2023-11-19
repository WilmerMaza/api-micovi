const { Router } = require("express");
const router = Router();
const { createIndicators, getIndicators } = require('../Services/IndicatorService.js');

router.post('/create-indicators', createIndicators);

router.get('/get-indicators', getIndicators);


module.exports = router;