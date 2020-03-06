import express from 'express';
const router = express.Router();

const { Customer, validateCustomer } = require('../models/customer');


// get all customers
router.get('/', async (req, res) => {
    const customers = await Customer.find();

    res.send(customers);
});

// get a single customer
router.get('/:userId', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

// create a customer
router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name
    });
    await customer.save();

    res.send(customer);
});

// update a customer
router.put('/:userId', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.userId, {
        name: req.body.name
    });


    res.send(customer);
});


// delete a customer
router.delete('/:userId', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.userId);

    res.send(customer);
});


module.exports = router;