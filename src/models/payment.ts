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
        required: true
    },
    sellerStripeId:{
        type: String,
        required: true
    },
    stripeObject: {
        type: mongoose.Schema.Types.any,
        required: true,
    }
},  { minimize: false }))

function validatePayment(payment){
    const schema = Joi.object({
        buyerId: Joi.objectId().required(),
        amountPaid: Joi.number().positive().precision(2).strict().required(),
        buyerStripeId: Joi.String().required(),
        sellerStripeId: Joi.String().required(),
        stripeObject: Joi.object().allow(null).required()
    });

    return schema.validate(payment);
}

exports.Payment = Payment;
exports.validatePayment = validatePayment;