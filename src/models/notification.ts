var mongoose = require('mongoose');
var Joi = require('joi');


const notificationTypeSchema = new mongoose.Schema({
    type: { type: String, required: true }
});

const NotificationType = mongoose.model('NotificationType', notificationTypeSchema);

var SysNotification = mongoose.model('SysNotification', new mongoose.Schema({

    notificationType: { type: notificationTypeSchema, required: true },
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
        ref: 'Promotion Order Quotations',
        required: true
    },
    viewed: { type: Boolean, default: false }

}));



function validateSysNotification(sysNotification) {

    const schema = {
        notificationType: Joi.string().required(),
        recipients: Joi.array().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
        target: Joi.objectId().required()
    };

    return Joi.validate(sysNotification, schema);
}


function validateNotificationType(notificationType) {

    const schema = {
        type: Joi.string().required(),
    };

    return Joi.validate(notificationType, schema);
}


exports.SysNotification = SysNotification;
exports.NotificationType = NotificationType;
exports.validateSysNotification = validateSysNotification;
exports.validateNotificationType = validateNotificationType;