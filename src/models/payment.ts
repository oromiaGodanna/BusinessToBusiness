export {};
const mongoose = require('mongoose');
const Joi = require('joi');

mongoose.set('useFindAndModify', false);

const Payment = mongoose.model('Payment', new mongoose.Schema({
    
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    buyerStripeId:{
        type: String,
        
    },
    sellerStripeId:{
        type: String,
        
    },
    stripeObject: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
},  { minimize: false }))

function validatePayment(payment){
    const schema = Joi.object({
        orderId: Joi.objectId().required(),
        amountPaid: Joi.number().positive().precision(2).strict().required(),
        buyerStripeId: Joi.string().allow('').required(),
        sellerStripeId: Joi.string().allow('').required(),
        stripeObject: Joi.object().allow(null).required()
    });

    return schema.validate(payment);
}

exports.Payment = Payment;
exports.validatePayment = validatePayment;