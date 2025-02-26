const express = require('express');
const {reservedSeat}=require('../controller/seatController');
const { verifyPayment } = require('../controller/paymentController');


const router = express.Router();

router.post('/', reservedSeat)


router.post('/verify',verifyPayment);



module.exports = router;