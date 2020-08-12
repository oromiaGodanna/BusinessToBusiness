import express from 'express';
const router = express.Router();
const jwt = require('jsonwebtoken');

const { Customer, validateCustomer } = require('../models/customer');


// login
router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findOne({ name: req.body.name});
    if (!customer) return res.status(400).send('Invalid name');

    const token = customer.generateAuthToken();  
    res.header('x-auth-token', token)
        .header('Access-Control-Expose-Headers', 'x-auth-token')
        .send(true); 
    // res.send(token as string);
});


module.exports = router;