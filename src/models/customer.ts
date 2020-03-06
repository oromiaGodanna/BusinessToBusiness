var mongoose = require('mongoose');
var Joi = require('joi');


const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: { type: String, required: true}
}));



function validateCustomer(customer) {

    const schema = {
        name: Joi.string().required()
    };

    return Joi.validate(customer, schema);
}


exports.Customer = Customer;
exports.validateCustomer = validateCustomer;