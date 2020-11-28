export {};
const {Payment, validatePayment} = require('../models/payment');
const express = require('express');
const router = express.Router();


router.post('/createPayment', async (req, res) => {
    //validate the request 
    const { error } = validatePayment(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let payment = new Payment({ 
        orderId: req.body.orderId,
        amountPaid: req.body.amountPaid,
        buyerStripeId: req.body.buyerStripeId,
        sellerStripeId: req.body.sellerStripeId,
        stripeObject: req.body.stripeObject
    });
    console.log(payment);
    payment = await payment.save();
    res.send(payment);

});


module.exports = router;