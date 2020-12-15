export {};

const { unreadCount, sendMessage, getConversation, createConversation } = require('../routes/message');


var MessageSocket = function (io, socket) {
    this.io = io;
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        message: message.bind(this), // use the bind function to access this.io   // and this.socket in events
        'get unread count': getUnreadMessageCount.bind(this),
        'get conversation': getConversationRealtime.bind(this),
        'create conversation': createConversationRealtime.bind(this),
    };
}

// Events

async function message(convId, message) {

    console.log(convId, message);

    this.io.to(convId).emit('new message', { convId: convId, message: message });
    await sendMessage(convId, message);
    // for sender
    let countForSender = await unreadCount(this.socket, true);

    // the user has no conversations
    if(!countForSender) return;

    this.io.to(this.socket.user._id).emit('unreadCount', countForSender[0]);
    console.log(`countForSender.first: ${countForSender[0]}`);

    // for receiver
    let countForReceiver = await unreadCount(this.socket, false);

    // the user has no conversations
    if(!countForReceiver) return;

    this.io.to(countForReceiver[1]).emit('unreadCount', countForReceiver[0]);
    console.log(`countForReceiver.first: ${countForSender[0]}`);

};

async function getUnreadMessageCount(){
    
    let countForSender = await unreadCount(this.socket, true);

    // the user has no conversations
    if(!countForSender) return;

    this.io.to(this.socket.user._id).emit('unreadCount', countForSender[0]);
}


async function getConversationRealtime(convId){

   
    let conversation = await getConversation(convId, this.socket);

    this.io.to(this.socket.user._id).emit('receive conversation', conversation);

    // update number of unread messages
    let countForSender = await unreadCount(this.socket, true);
    this.io.to(this.socket.user._id).emit('unreadCount', countForSender[0]);
}

async function createConversationRealtime(conversation){

    const { error } = validateConversation(conversation);
    if (error) return this.socket.error(error.details[0].message);

    // create a notification
    const newConversation = await createConversation(conversation);

    console.log(newConversation);

    newConversation.users.forEach(async userId => {

        // send conversation list to both users
        const conversations = await Conversation
        .find({
            users: userId,
        });
        this.io.to(userId).emit('conversations', conversations);

    });

}


module.exports = MessageSocket;