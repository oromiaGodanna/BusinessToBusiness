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
    description: {
        type: String,
    },
    numOfProducts: {
        type: Number,
    },
    numOfQuatations: {
        type: Number
    },
    numOfEmails: {
        type: Number
    },
    monthlyPrice: {
        type: Number
    }, 
    // availableOn: {
    //     type: Boolean || Date,
    //     default: true || new Date()
    // }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;

module.exports.validateSubscription = function(subscription){
    const schema = {
        name: Joi.string().required(),
        description: Joi.string(),
        numOfProducts: Joi.number().integer(),
        numOfQuatations: Joi.number().integer(),
        numOfEmails : Joi.number().integer(),
        monthlyPrice: Joi.number(),
        rate: Joi.number().integer(),
        // available: Joi.alternatives().try(Joi.Boolean(),Joi.Date())

    };
    return Joi.validate(subscription, schema)
}