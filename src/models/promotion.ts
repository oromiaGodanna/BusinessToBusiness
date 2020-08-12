
var mongoose = require('mongoose');
var Joi = require('joi');

/* const Promotion = mongoose.model('Promotion', new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    methods: {
        type: {
            email: { type: Boolean, default: false },
            sms: { type: Boolean, default: false },
            notification: { type: Boolean, default: false }
        }, required: true
    },
    recipients: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Customer',
        required: true
    },
    date: { type: Date, default: Date.now },
    emailTemplate: {
        to: String,
        subject: String,
        username: String,
        intro: String,
        instructions: String,
        buttonText: String,
        buttonLink: String
    },
    smsTemplate: {
        to: [String],
        body: String
    },
    notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    }

}));
*/

const Email = mongoose.model('Email', new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    recipients: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Customer',
        required: true
    },
    date: { type: Date, default: Date.now },
    to: { type: [String], required: true },
    subject: { type: String, required: true },
    username: { type: [String], required: true },
    intro: { type: [String], required: true },
    instructions: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true }

}));

const Sms = mongoose.model('Sms', new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    recipients: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Customer',
        required: true
    },
    to: { type: [String], required: true },
    body: { type: String, required: true },
}));




function validatePromotion(promotion) {

    const schema = {
        sender: Joi.objectId().required(),
        methods: {
            email: Joi.boolean(),
            sms: Joi.boolean(),
            notification: Joi.boolean()
        },
        recipients: Joi.array().items(Joi.objectId()).required()
    };

    return Joi.validate(promotion, schema);
}


function validateEmailVerification(request) {

    const schema = {
        to: Joi.string().required(),
        username: Joi.string().required()
    }

    return Joi.validate(request, schema);
}

function validateOrderStatus(request) {

    const schema = {
        to: Joi.string().required(),
        username: Joi.string().required(),
        orderNumber: Joi.string().required()
    }

    return Joi.validate(request, schema);
}


function validatePromotionEmail(request) {

    const schema = {
        sender: Joi.objectId().required(),
        recipients: Joi.array().items(Joi.objectId()).required(),
        to: Joi.array().items(Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })).required(),
        username: Joi.array().items(Joi.string()).required(),
        subject: Joi.string().required(),
        intro: Joi.array().items(Joi.string()).required(),
        instructions: Joi.string().required(),
        buttonText: Joi.string().required(),
        buttonLink: Joi.string().required()

    }

    return Joi.validate(request, schema);
}


function validateSms(request) {

    const schema = {
        sender: Joi.objectId().required(),
        recipients: Joi.array().items(Joi.objectId()).required(),
        to: Joi.array().items(Joi.string()).required(), // must validate phone number
        body: Joi.string().required(),
    }

    return Joi.validate(request, schema);
}


// exports.Promotion = Promotion;
exports.validatePromotion = validatePromotion;
exports.validateEmailVerification = validateEmailVerification;
exports.validateOrderStatus = validateOrderStatus;
exports.validatePromotionEmail = validatePromotionEmail;
exports.validateSms = validateSms;

exports.Email = Email;
exports.Sms = Sms;
