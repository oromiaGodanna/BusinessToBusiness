export { };

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
var _ = require('lodash');

var { Conversation, Message, validateMessage, validateConversation } = require('../models/message');


// get all conversations of user
router.get('', auth, async (req, res) => {

    const conversations = await Conversation
        .find({
            users: req.user._id
        })
        .populate('users', 'firstName')
        .sort('-dateOfLastMessage')
        .select({ messages: 0 });

    res.send(conversations);
});

// get a single conversation
router.get('/:convId', auth, async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.convId)) {
        return res.status(404).send('Invalid Id.');
    }

    // var conversation = await Conversation
    //     .findById(
    //         req.params.convId,
    //         {
    //             // get the last n  messages
    //             // messages: { $slice: -10, },
    //         }
    //     )
    //     .populate('messages.sender', 'name image');


    let conversation = await Conversation.findOneAndUpdate(
        {
            _id: req.params.convId,
            "tracking.userId": req.user._id,
        },
        {
            $set: {
                "tracking.$.lastTime": Date.now()
            }
        },
        { new: true }
    ).populate('messages.sender', 'firstName image');

    console.log(conversation);


    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');

    // console.log(conversation.messages);

    // don't return deleted messages
    conversation = conversation.getUndeletedMessages(req.user._id);

    // console.log(conversation.messages);

    res.send(conversation);
});

// must be called everytime a new-message event is sent
// sends unread message count for each conversation, add all to get total
router.get('/unreadCount', auth, async (req, res) => {


    const conversations = await Conversation
        .find({
            users: req.user._id,
            "tracking.userId": req.user._id,
            "dateOfLastMessage": { $gt: "tracking.$.lastTime" },
        });

    console.log(conversations);

    let count: { convId: string, unread: number }[] = [];

    conversations.forEach(conv => {
        count.push({ convId: conv._id, unread: 0 });
    });

    conversations.forEach(conv => {
        let userTracker = conv.tracking.where((userTracker) => { userTracker.userId == req.user._id });
        conv.messages.forEach(msg => {
            if (msg.date > userTracker.lastTime) {
                let index = count.findIndex((countTracker) => { countTracker.convId == conv._id });
                count[index].unread = count[index].unread++;
            }
        });
    });


    res.send(count);
});




// create a conversation
router.post('/', auth, async (req, res) => {
    const { error } = validateConversation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let conversation = new Conversation({
        users: req.body.users,
        messages: req.body.messages, // empty
        tracking: [
            { userId: req.body.users[0], lastTime: Date.now() },
            { userId: req.body.users[1], lastTime: Date.now() },
        ]
    });

    // check that conversation between these users doesn't already exist
    const conv = await Conversation.find({
        users: { $size: 2, $all: conversation.users }
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

    var now = Date.now();

    // must update while in database???
    const newMessage = new Message({
        sender: req.user._id,
        message: req.body.message,
        product: req.body.product,
        users: req.body.users,
        date: now
        //attachment: req.body.attachment,
    });

    // console.log(newMessage);

    const conversation = await Conversation.findOneAndUpdate(
        {
            _id: req.params.convId,
            "tracking.userId": req.user._id,
        },
        {
            $push: { messages: newMessage },
            dateOfLastMessage: newMessage.date,
            $set: {
                "tracking.$.lastTime": now
            }
        },
        { new: true }
    ).populate('messages.sender', 'firstName image');


    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');


    // don't return deleted messages
    conversation.getUndeletedMessages(req.user._id);

    res.send(conversation);
});

// remove a message
router.put('/deleteMany/:convId', auth, async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.convId)) {
        return res.status(404).send('Invalid Id.');
    }

    // if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    //     return res.status(404).send('Invalid user id.');
    // }


    const messageIds = req.body.messageIds;


    let conversation = await Conversation.findById(req.params.convId).populate('messages.sender', 'firstName image');

    if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');

    messageIds.forEach(messageId => {
        const message = conversation.messages.id(messageId);

        if (!message.deleted.includes(req.user._id)) {
            message.deleted.push(req.user._id);
        }

    });


    await conversation.save();

    // console.log(conversation);

    let userId = req.user._id;

    // don't return deleted messages
    conversation = conversation.getUndeletedMessages(userId);

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


    if (!conversation.deleted.includes(req.user._id)) {
        conversation.deleted.push(req.user._id);
    }

    // if both users have deleted the conversation, so delete it from the database
    // if (_.isEmpty(_.xor(conversation.deleted, conversation.users))) {
    //     await Conversation.deleteOne({ _id: conversation._id });

    //     res.send(conversation);
    // }

    await conversation.save();

    res.send(conversation);
});


///**********************Functions***********************************/


async function unreadCount(socket, isSender) {
    const conversations = await Conversation
        .find({
            users: socket.user._id,
        });




    let count: { convId: string, unread: number }[] = [];

    conversations.forEach(conv => {
        count.push({ convId: conv._id, unread: 0 });
    });

    let userTracker;

    conversations.forEach(conv => {
        userTracker = conv.tracking.find((userTracker) => {
            return isSender
                ? userTracker.userId == socket.user._id
                : userTracker.userId != socket.user._id
        });
        console.log(`userTracker: ${userTracker}`);
        conv.messages.forEach(msg => {
            console.log(`msg.date: ${msg.date}`);
            console.log(`condition: ${msg.date > userTracker.lastTime}`);
            if (msg.date > userTracker.lastTime) {
                let index = count.findIndex((countTracker) => { return countTracker.convId == conv._id });
                console.log(`index in unreadCount: ${index}`);
                console.log(`count at index: ${count[index]}`);
                if (count[index]) {
                    count[index].unread = count[index].unread + 1;
                    console.log(`count[index].unread: ${count[index].unread}`);
                }
            }
        });
    });

    console.log(count);

    if (conversations.length == 0) return;

    return [count, userTracker.userId];
}


async function joinConversations(socket) {

    const conversations = await Conversation
        .find({
            users: socket.user._id,
            // "tracking.userId": socket.user._id,
            // "dateOfLastMessage": { $gt: "tracking.$.lastTime" },
        });


    conversations.forEach(conv => {
        socket.join(conv._id);
        console.log(`${conv._id} has been joined`);
    });


}

async function sendMessage(convId, message) {
    // const { error } = validateMessage(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // if (!mongoose.Types.ObjectId.isValid(req.params.convId)) {
    //     return res.status(404).send('Invalid Id.');
    // }


    // must update while in database???
    const newMessage = new Message({
        sender: message.sender._id,
        message: message.message,
        product: message.product,
        date: Date.now()
        //attachment: req.body.attachment,
    });

    // console.log(newMessage);

    const conversation = await Conversation.findOneAndUpdate(
        {
            _id: convId,
            "tracking.userId": message.sender,
        },
        {
            $push: { messages: newMessage },
            dateOfLastMessage: newMessage.date,
            $set: {
                "tracking.$.lastTime": newMessage.date
            }
        },
        { new: true }
    ).populate('messages.sender', 'firstName image');


    // if (!conversation) return res.status(404).send('The conversation with the given ID was not found.');

    // console.log(conversation);

    // don't return deleted messages
    // conversation.getUndeletedMessages(message.sender._id);

    // res.send(conversation);
}

async function getConversation(convId, socket){

    if (!mongoose.Types.ObjectId.isValid(convId)) {
        return socket.console.error('Invalid Id.');   
    }

    let conversation = await Conversation.findOneAndUpdate(
        {
            _id: convId,
            "tracking.userId": socket.user._id,
        },
        {
            $set: {
                "tracking.$.lastTime": Date.now()
            }
        },
        { new: true }
    ).populate('messages.sender', 'firstName image');


    if (!conversation) return socket.error('The conversation with the given ID was not found.');

    // don't return deleted messages
    conversation = conversation.getUndeletedMessages(socket.user._id);

    return conversation;

}


module.exports = {
    message: router,
    unreadCount: unreadCount,
    sendMessage: sendMessage,
    joinConversations: joinConversations,
    getConversation: getConversation
};

