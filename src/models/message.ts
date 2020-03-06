var mongoose = require('mongoose');
var Joi = require('joi');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    message: { type: String, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    attachment: { type: Buffer },
    date: { type: Date, default: Date.now },
    deleted: {
        type: new mongoose.Schema({
            user1: { type: Boolean, default: false},
            user2: { type: Boolean, default: false}
        }),
        default: {
            user1: false,
            user2: false
        }
    }
});

const Message = mongoose.model('Message', messageSchema);

const Conversation = mongoose.model('Conversation', new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    messages: { type: [messageSchema], required: true },
    dateOfLastMessage: { type: Date, default: Date.now },
    deleted: {
        type: new mongoose.Schema({
            user1: { type: Boolean, default: false},
            user2: { type: Boolean, default: false}
        }),
        default: { user1: false, user2: false}
    }
}));



function validateMessage(message) {

    const schema = {
        sender: Joi.objectId(),
        message: Joi.string().required(),
        product: Joi.objectId(),
        //attachment: Joi.blob(),
    };

    return Joi.validate(message, schema);
}

function validateConversation(conversation) {

    const schema = {
        user1: Joi.objectId().required(),
        user2: Joi.objectId().required(),
        messages: Joi.array(),
    };

    return Joi.validate(conversation, schema);
}


exports.Conversation = Conversation;
exports.Message = Message;
exports.validateMessage = validateMessage;
exports.validateConversation = validateConversation;