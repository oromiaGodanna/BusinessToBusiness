var mongoose = require('mongoose');
var Joi = require('joi');

const Promotion = mongoose.model('Promotion', new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    methods: { type: [Boolean], required: true, /*custom validator: array length should be 3*/ },
    recipients: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Customer',
        required: true
    },
    date: { type: Date, default: Date.now}

}));



function validatePromotion(promotion) {

    const schema = {
        sender: Joi.objectId().required(),
        methods: Joi.array().length(3).required(),
        recipients: Joi.array().objectId()
    };

    return Joi.validate(promotion, schema);
}


function validateEmailVerification(request){

    const schema = {
        to: Joi.string().required(),
        username: Joi.string().required()
    }

    return Joi.validate(request, schema);
}

function validateOrderStatus(request){

    const schema = {
        to: Joi.string().required(),
        username: Joi.string().required(),
        orderNumber: Joi.string().required()
    }

    return Joi.validate(request, schema);
}


function validatePromotionEmail(request){

    const schema = {
        to: Joi.string().required(),
        username: Joi.string().required(),
        subject: Joi.string().required(),
        intro: Joi.array().required(),
        instructions: Joi.string().required(),
        buttonText: Joi.string().required(),
        buttonLink: Joi.string().required()

    }

    return Joi.validate(request, schema);
}


exports.Promotion = Promotion;
exports.validate = validatePromotion;
exports.validateEmailVerification = validateEmailVerification;
exports.validateOrderStatus = validateOrderStatus;
exports.validatePromotionEmail = validatePromotionEmail;