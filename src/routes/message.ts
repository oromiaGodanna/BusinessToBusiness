export { };

const express = require('express');
const router = express.Router();

var { Conversation, Message, validateMessage, validateConversation } = require('../models/message');


// get all conversations of user
router.get('/:userId', async (req, res) => {
    const conversations = await Conversation
        .find({
            $or: [
                { $and: [{ user1: req.params.userId }, { "deleted.user1": false }] },
                { $and: [{ user2: req.params.userId }, { "deleted.user2": false }] }
            ]
        })
        .sort('-dateOfLastMessage')
        .select({ messages: 0 });

    res.send(conversations);
});

// get a single conversation
router.get('/:userId/:convId', async (req, res) => {
    //const conversation = await Conversation.findById(req.params.convId);

    // get the last n  messages

    var conversation = await Conversation
        .find(
            {
                _id: req.params.convId,
            },
            {
                messages: { $slice: -2, },
            }
        );

    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');

    console.log(conversation);
    // TODO remove deleted messages. 
    // conversation.messages.forEach(message => {
    //     if (conversation.user1 == req.params.userId) {
    //         if (message.deleted.user1 == true) {
    //             message.remove();
    //         }
    //     } else if (conversation.user2 == req.params.userId) {
    //         if (message.deleted.user2 == true) {
    //             message.remove();
    //         }
    //     }
    // });

    res.send(conversation);
});

// create a conversation
router.post('/', async (req, res) => {
    const { error } = validateConversation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const conversation = new Conversation({
        user1: req.body.user1,
        user2: req.body.user2,
        messages: req.body.messages // empty
    });
    await conversation.save();

    res.send(conversation);
});

// send a message
router.put('/:convId', async (req, res) => {
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const conversation = await Conversation.findById(req.params.convId);

    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');

    const newMessage = new Message({
        sender: req.body.sender,
        message: req.body.message,
        product: req.body.product,
        attachment: req.body.attachment,
    });
    conversation.messages.push(newMessage);
    conversation.dateOfLastMessage = newMessage.date;

    await conversation.save();

    res.send(conversation);
});

// remove a message
router.put('/:userId/:convId/:messageId', async (req, res) => {

    const conversation = await Conversation.findById(req.params.convId);

    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');

    const message = conversation.messages.id(req.params.messageId);
    if (conversation.user1 == req.params.userId) {
        message.deleted.user1 = true;
    } else {
        message.deleted.user2 = true;
    }
    await conversation.save();

    res.send(conversation);
});

// delete a conversation
router.delete('/:userId/:convId', async (req, res) => {
    const conversation = await Conversation.findById(req.params.convId);

    if (!conversation) return res.status(404).send('The Conversation with the given ID was not found.');

    if (conversation.user1 == req.params.userId) {
        conversation.deleted.user1 = true;
    } else {
        conversation.deleted.user2 = true;
    }
    await conversation.save();

    res.send(conversation);
});


module.exports = router;