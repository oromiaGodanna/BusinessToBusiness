export { };

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

var { Conversation, Message, validateMessage, validateConversation } = require('../models/message');


// get all conversations of user
router.get('', auth, async (req, res) => {
    const conversations = await Conversation
        .find({
            $or: [
                { $and: [{ user1: req.user._id }, { "deleted.user1": false }] },
                { $and: [{ user2: req.user._id }, { "deleted.user2": false }] }
            ]
        })
        .populate('user1 user2', 'name')
        .sort('-dateOfLastMessage')
        .select({ messages: 0 });

    res.send(conversations);
});

// get a single conversation
router.get('/:convId', auth, async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.convId)) {
        return res.status(404).send('Invalid Id.');
    }

    var conversation = await Conversation
        .findById(
            req.params.convId,
            {
                // get the last n  messages
                // messages: { $slice: -10, },
            }
        )
        .populate('messages.sender', 'name image');

    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');

    console.log(conversation.messages);
    // don't return deleted messages
    for (let index = conversation.messages.length - 1; index >= 0; --index) {

        let msg = conversation.messages[index];

        if (conversation.user1 == req.user._id) {
            if (msg.deleted.user1) {
                let index = conversation.messages.indexOf(msg);
                conversation.messages.splice(index, 1);
            }
        }

        else if (conversation.user2 == req.user._id) {
            if (msg.deleted.user2) {
                let index = conversation.messages.indexOf(msg);
                conversation.messages.splice(index, 1);
            }
        }

    }

    console.log(conversation.messages);

    res.send(conversation);
});

// create a conversation
router.post('/', auth, async (req, res) => {
    const { error } = validateConversation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let conversation = new Conversation({
        user1: req.user._id,
        user2: req.body.user2,
        messages: req.body.messages // empty
    });

    // check that conversation between these users doesn't already exist
    const conv = await Conversation.find({
        $or: [
            { $and: [{ user1: conversation.user1 }, { user2: conversation.user2 }] },
            { $and: [{ user1: conversation.user2 }, { user2: conversation.user1 }] }
        ]
    });

    // console.log(conv);

    if (conv.length == 0) {
        await conversation.save();
    } else {
        conversation = conv[0];
    }

    res.send(conversation);
});

// send a message
router.put('/:convId', auth, async (req, res) => {
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!mongoose.Types.ObjectId.isValid(req.params.convId)) {
        return res.status(404).send('Invalid Id.');
    }

    // must update while in database???
    const newMessage = new Message({
        sender: req.user._id,
        message: req.body.message,
        product: req.body.product,
        //attachment: req.body.attachment,
    });

    console.log(newMessage);

    const conversation = await Conversation.findOneAndUpdate(
        { _id: req.params.convId },
        {
            $push: { messages: newMessage },
            dateOfLastMessage: newMessage.date
        },
        { new: true }
    ).populate('messages.sender', 'name image');


    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');


    // don't return deleted messages
    for (let index = conversation.messages.length - 1; index >= 0; --index) {

        let msg = conversation.messages[index];

        if (conversation.user1 == req.user._id) {
            if (msg.deleted.user1) {
                let index = conversation.messages.indexOf(msg);
                conversation.messages.splice(index, 1);
            }
        }

        else if (conversation.user2 == req.user._id) {
            if (msg.deleted.user2) {
                let index = conversation.messages.indexOf(msg);
                conversation.messages.splice(index, 1);
            }
        }

    }

    res.send(conversation);
});

// remove a message
router.put('/:convId/deleteMany', auth, async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.convId)) {
        return res.status(404).send('Invalid Id.');
    }

    // if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    //     return res.status(404).send('Invalid user id.');
    // }


    const messageIds = req.body.messageIds;


    const conversation = await Conversation.findById(req.params.convId).populate('messages.sender', 'name image');

    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');

    messageIds.forEach(messageId => {
        const message = conversation.messages.id(messageId);
        if (conversation.user1 == req.user._id) {
            message.deleted.user1 = true;
        } else if (conversation.user2 == req.user._id) {
            message.deleted.user2 = true;
        } else {
            return res.status(404).send('User with the given id was not found');
        }
    });
    // const message = conversation.messages.id(req.params.messageId);
    // if (conversation.user1 == req.user._id) {
    //     message.deleted.user1 = true;
    // } else if (conversation.user2 == req.user._id) {
    //     message.deleted.user2 = true;
    // } else {
    //     return res.status(404).send('User with the given id was not found');
    // }

    await conversation.save();

    // don't return deleted messages
    for (let index = conversation.messages.length - 1; index >= 0; --index) {

        let msg = conversation.messages[index];

        if (conversation.user1 == req.user._id) {
            if (msg.deleted.user1) {
                let index = conversation.messages.indexOf(msg);
                conversation.messages.splice(index, 1);
            }
        }

        else if (conversation.user2 == req.user._id) {
            if (msg.deleted.user2) {
                let index = conversation.messages.indexOf(msg);
                conversation.messages.splice(index, 1);
            }
        }

    }

    // console.log(conversation.messages)

    res.send(conversation);
});

// delete a conversation
router.delete('/:convId', auth, async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.convId)) {
        return res.status(404).send('Invalid conversation id.');
    }

    // if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    //     return res.status(404).send('Invalid user id.');
    // }

    const conversation = await Conversation.findById(req.params.convId);

    if (!conversation) return res.status(404).send('The Conversation with the given ID was not found.');

    if (conversation.user1 == req.user._id) {
        conversation.deleted.user1 = true;
    } else if (conversation.user2 == req.user._id) {
        conversation.deleted.user2 = true;
    } else {
        return res.status(404).send('User with the given id was not found');
    }
    await conversation.save();

    res.send(conversation);
});


module.exports = router;