const { Router } = require("express");
const router = Router();
const { createIndicators } = require('../Services/IndicatorService.js');

router.post('/create-indicators', createIndicators);


module.exports = router;