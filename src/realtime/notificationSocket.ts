import { Socket } from "dgram";

const { createNotification, numOfUnreadNotification, markAsViewed } = require('../routes/notification');
const { validateSysNotification } = require('../models/notification');
const mongoose = require('mongoose');

var NotificationSocket = function (io, socket) {
    this.io = io;
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        notification: notification.bind(this), // use the bind function to access this.io   // and this.socket in events
        viewed: viewed.bind(this),
        'get unread count': getUnreadCount.bind(this),
    };
}

// Events

async function notification(notification) {

    const { error } = validateSysNotification(notification);
    if (error) return this.socket.error(error.details[0].message);

    // create a notification
    const newNotification = await createNotification(notification);

    console.log(newNotification);

    newNotification.recipients.forEach(async recipientId => {
        // this.io.to(recipientId).emit('new notification', newNotification);
        // console.log(`event sent back to ${recipientId}`);

        // send number of unread notification to user
        const count = await numOfUnreadNotification(recipientId);
        this.io.to(recipientId).emit('unread notification count', count);
    });


};


async function viewed(notificationId) {

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return this.socket.error('Invalid Id.');
    }

    const notification = await markAsViewed(notificationId, this.socket.user._id);

    this.io.to(this.socket.user._id).emit('viewed notification', notification);


    const count = await numOfUnreadNotification(this.socket.user._id);
    this.io.to(this.socket.user._id).emit('unread notification count', count);
}


async function getUnreadCount() {

    const count = await numOfUnreadNotification(this.socket.user._id);
    this.io.to(this.socket.user._id).emit('unread notification count', count);
}


module.exports = NotificationSocket;