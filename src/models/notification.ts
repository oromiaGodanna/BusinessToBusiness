var mongoose = require('mongoose');
var Joi = require('joi');


// const notificationTypeSchema = new mongoose.Schema({
//     type: { type: String, required: true }
// });

// const NotificationType = mongoose.model('NotificationType', notificationTypeSchema);

var SysNotification = mongoose.model('SysNotification', new mongoose.Schema({

    notificationType: {
        type: String, 
        required: true,
        enum: ['promotion', 'order', 'performa']
    },
    recipients: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Customer',
        required: true
    },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    content: { type: String, required: true },
    // how to make the target refer to multiple collections?
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'externalModelType',
        required: true
    },
    externalModelType: {
        type: String, 
        required: true,
        enum: ['Promotion', 'Order', 'Performa']
    },
    viewed: { type: Boolean, default: false },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

}));



function validateSysNotification(sysNotification) {

    const schema = {
        notificationType: Joi.string().valid('performa', 'promotion', 'order').required(),
        recipients: Joi.array().items(Joi.objectId()).required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
        target: Joi.objectId().required(),
        externalModelType: Joi.string().valid('Performa', 'Promotion', 'Order').required()
    };

    return Joi.validate(sysNotification, schema);
}

function validateType(not_type) {

    const type = Joi.string().valid('performa', 'promotion', 'order').required();

    return Joi.validate(not_type, type);
}


// function validateNotificationType(notificationType) {

//     const schema = {
//         type: Joi.string().required(),
//     };

//     return Joi.validate(notificationType, schema);
// }


exports.SysNotification = SysNotification;
// exports.NotificationType = NotificationType;
exports.validateSysNotification = validateSysNotification;
exports.validateType = validateType;
// exports.validateNotificationType = validateNotificationType;
