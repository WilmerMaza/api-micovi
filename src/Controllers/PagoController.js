const { Router } = require('express');
const router = Router();
const { createPayment, captureOrder } = require("../Services/PaymentService.js")

router.post('/create-payment', createPayment)
router.get('/capture-payment', captureOrder)

module.exports = router;