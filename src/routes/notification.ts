import express from 'express';
const router = express.Router();

const { SysNotification,
    NotificationType,
    validateSysNotification,
    validateNotificationType } = require('../models/notification');


// get all notifications of user
router.get('/user/:userId', async (req, res) => {
    const notifications = await SysNotification.find({
        recipients: req.params.userId
    });

    if (!notifications) return res.status(200).send('There are no notifications for this user.');

    res.send(notifications);
});

// get a single notification
router.get('/:id', async (req, res) => {
    const notification = await SysNotification.findById(req.params.id);

    if (!notification) return res.status(404).send('The notification with the given ID was not found.');

    res.send(notification);
});

// get all notifications of user, by type
router.get('/user/:userId/type/:type', async (req, res) => {

    const notifications = await SysNotification.find({
        recipients: req.params.userId,
        notificationType: req.params.type
    });

    if (!notifications) return res.status(200).send('There are no notifications of this type for this user.');

    res.send(notifications);
});

// create a notification
router.post('/', async (req, res) => {
    const { error } = validateSysNotification(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const notification = new SysNotification({
        notificationType: req.body.notificationType,
        recipients: req.body.recipients,
        title: req.body.title,
        content: req.body.content,
        target: req.body.target
    });
    await notification.save();

    res.send(notification);
});


// delete a notification
router.delete('/:id', async (req, res) => {
    const notification = await SysNotification.findByIdAndRemove(req.params.id);

    if (!notification) return res.status(404).send('The notification with the given ID was not found.');

    res.send(notification);
});


// delete all notifications of user, clear
router.delete('/user/:userId', async (req, res) => {
    const notifications = await SysNotification.updateMany({
        recipients: req.params.userId
    }, 
    {
        $pullAll: { recipients: [ req.params.userId ] }
    }
    );

    if (!notifications) return res.status(404).send('There are no notifications for this user.');

    //console.log(notifications);

    res.send(notifications);
});



// delete all notifications of user, by type
router.delete('/user/:userId/type/:type', async (req, res) => {
    const notifications = await SysNotification.updateMany({
        recipients: req.params.userId,
        notificationType: req.params.type
    }, 
    {
        $pullAll: { recipients: [ req.params.userId ] }
    }
    );

    if (!notifications) return res.status(404).send('There are no notifications for this user.');

    //console.log(notifications);

    res.send(notifications);
});


/********************************notification_type**************** */


// // create a notification type
// router.post('/type', async (req, res) => {
//     const { error } = validateNotificationType(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const notificationType = new NotificationType({
//         type: req.body.type
//     });
//     await notificationType.save();

//     res.send(notificationType);
// });



module.exports = router;