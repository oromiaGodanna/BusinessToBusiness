export{};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const subscriptionSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please Enter the name for the subscription'],
        unique: true
    },
    numOfPRoducts: {
        type: Number,
    },
    numOfQuatations: {
        type: Number
    },
    numOfEmail: {
        type: Number
    },
    monthlyPrice: {
        type: Number
    }, 
    // available: {
    //     type: Boolean || Date,
    //     default: true || Date.now
    // }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;

module.exports.validateSubscription = function(subscription){
    const schema = {
        name: Joi.string().alphanum().required(),
        numOfProducts: Joi.number().integer(),
        numOfQuatations: Joi.number().integer(),
        numOfEmail : Joi.number().integer(),
        monthlyPrice: Joi.number(),
        //available: Joi.Boolean(),

    };
    return Joi.validate(subscription, schema)
}