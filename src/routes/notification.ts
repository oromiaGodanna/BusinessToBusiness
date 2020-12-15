export { };

import express from 'express';
const router = express.Router();
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

const { SysNotification,
    validateSysNotification,
    validateType } = require('../models/notification');


// get all notifications of user
router.get('', auth, async (req: any, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).send('Invalid Id.');
    }

    const notifications = await SysNotification.find({
        recipients: req.user._id
    });

    // if (!notifications) return res.status(404).send('There is no user with this id.');

    res.send(notifications);
});

// get all promotion notifications sent by user
router.get('/sender', auth, async (req: any, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(404).send('Invalid Id.');
    }

    const notifications = await SysNotification.find({
        target: req.user._id,
        notificationType: 'promotion'
    });

    // if (!notifications) return res.status(404).send('There is no user with this id.');

    res.send(notifications);
});

// get a single notification
router.get('/:id', auth, async (req: any, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid Id.');
    }

    const notification = await SysNotification.findById(req.params.id);

    if (!notification) return res.status(404).send('The notification with the given ID was not found.');

    res.send(notification);
});



// get all notifications of user, by type
router.get('/type/:type', auth, async (req: any, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).send('Invalid Id.');
    }

    // type should be validated
    const { error } = validateType(req.params.type);
    if (error) return res.status(400).send(error.details[0].message);

    const notifications = await SysNotification.find({
        recipients: req.user._id,
        notificationType: req.params.type
    });

    // if (!notifications) return res.status(200).send('There are no notifications of this type for this user.');

    res.send(notifications);
});





// create a notification
router.post('/', auth, async (req: any, res) => {
    const { error } = validateSysNotification(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const notification = new SysNotification({
        sender: req.user._id,
        notificationType: req.body.notificationType,
        recipients: req.body.recipients,
        title: req.body.title,
        content: req.body.content,
        target: req.body.target,
        externalModelType: req.body.externalModelType
    });
    await notification.save();

    res.send(notification);
});

// mark as viewed
router.put('/:id', auth, async (req: any, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid Id.');
    }

    const notification = await SysNotification.findByIdAndUpdate(
        req.params.id,
        { $push: { viewed: req.user._id } },
        { new: true }
    );

    if (!notification) return res.status(404).send('The notification with the given ID was not found.');

    res.send(notification);
});


// delete a notification
router.delete('/:id', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid Id.');
    }

    const notification = await SysNotification.findByIdAndRemove(req.params.id);

    if (!notification) return res.status(404).send('The notification with the given ID was not found.');

    res.send(notification);
});


// delete all notifications of user, clear
router.delete('', auth, async (req: any, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).send('Invalid Id.');
    }

    const notifications = await SysNotification.updateMany({
        recipients: req.user._id
    },
        {
            $pullAll: { recipients: [req.user._id] }
        }
    );

    // if (!notifications) return res.status(404).send('There are no notifications for this user.');

    //console.log(notifications);

    res.send(notifications);
});



// delete all notifications of user, by type
router.delete('/type/:type', auth, async (req: any, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).send('Invalid Id.');
    }

    const { error } = validateType(req.params.type);
    if (error) return res.status(400).send(error.details[0].message);

    const notifications = await SysNotification.updateMany({
        recipients: req.user._id,
        notificationType: req.params.type
    },
        {
            $pullAll: { recipients: [req.user._id] }
        }
    );

    // if (!notifications) return res.status(404).send('There are no notifications for this user.');

    //console.log(notifications);

    res.send(notifications);
});



/////////////////////////////////**************Functions******************************** */


async function createNotification(notification) {
    // const { error } = validateSysNotification(notification);
    // if (error) return res.status(400).send(error.details[0].message);

    const newNotification = new SysNotification({
        notificationType: notification.notificationType,
        recipients: notification.recipients,
        title: notification.title,
        content: notification.content,
        target: notification.target,
        externalModelType: notification.externalModelType
    });
    await newNotification.save();

    return newNotification;
    // res.send(newNotification);
}


async function numOfUnreadNotification(userId){

    const count = await SysNotification.countDocuments({
        recipients: userId,
        viewed: { "$ne": userId}
    });

    return count;
}


async function markAsViewed(notificationId, userId){
    const notification = await SysNotification.findByIdAndUpdate(
        notificationId,
        { $push: { viewed: userId } },
        { new: true }
    );

    return notification;
}


module.exports = {
    notification: router,
    createNotification: createNotification,
    numOfUnreadNotification: numOfUnreadNotification,
    markAsViewed: markAsViewed
};