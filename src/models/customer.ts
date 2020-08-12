  
var mongoose = require('mongoose');
var Joi = require('joi');
const jwt = require('jsonwebtoken');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true}
});

customerSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, name: this.name}, 'jwtPrivateKey');
    return token;
}
const Customer = mongoose.model('Customer', customerSchema);



function validateCustomer(customer) {

    const schema = {
        name: Joi.string().required()
    };

    return Joi.validate(customer, schema);
}


exports.Customer = Customer;
exports.validateCustomer = validateCustomer;