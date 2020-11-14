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
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Customer',
        required: true,
        default: []
    },

});

const Message = mongoose.model('Message', messageSchema);


const conversationSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        }
    ],
    messages: { type: [messageSchema], default: [] },
    dateOfLastMessage: { type: Date, default: Date.now },
    deleted: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Customer',
        required: true,
        default: []
    },
    tracking: [
        {
            _id: false,
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Customer',
                required: true
            },
            lastTime: {
                type: Date,
                required: true
            }
        }
    ]
});

conversationSchema.methods.getUndeletedMessages = function (userId: string) {
    for (let index = this.messages.length - 1; index >= 0; --index) {

        let msg = this.messages[index];

        // console.log("userID is: " + userId);
        if (msg.deleted.includes(userId)) {
            // console.log("msg.deleted contains userId");
            let index = this.messages.indexOf(msg);
            this.messages.splice(index, 1);
        }
    }

    return this;
}

const Conversation = mongoose.model('Conversation', conversationSchema);



function validateMessage(message) {

    const schema = {
        message: Joi.string().required(),
        product: Joi.objectId(),
        //attachment: Joi.blob(),
    };

    return Joi.validate(message, schema);
}

function validateConversation(conversation) {

    const schema = {
        users: Joi.array().items(Joi.objectId()).length(2).required(),
        messages: Joi.array(),
    };

    return Joi.validate(conversation, schema);
}


exports.Conversation = Conversation;
exports.Message = Message;
exports.validateMessage = validateMessage;
exports.validateConversation = validateConversation;