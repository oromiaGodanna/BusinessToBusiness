export{};

const Subscription = require('../models/subscription');
const express = require('express');
const router = express.Router();

//create Subscription Model
router.post('/create', async (req, res) => {
    const { error } = Subscription.validateSubscription(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let subscription = new Subscription({
        name: req.body.name,
        numOfProducts: req.body.numOfProducts,
        numOfQuatations: req.body.numOfQuatations,
        numOfEmail: req.body.numOfEmail,
        monthlyPrice: req.body.monthlyPrice
    });
    try {
        const newSubscription = await subscription.save();
        res.json({
            status: 200,
            success: true,
            msg: 'Subscription successfully Created',
            subscription: newSubscription
        });
    } catch (error) {
        res.json({
            status: 400,
            success: false,
            msg: 'Failed to register Customer',
            errorMesage: error.errmsg
        });
    }
});

//getSubscriptionModel
router.get('/:id', async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription) return res.json({status: 404, success: false, msg: 'Subscription Model with this Id can not be found'});
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'The Subscription Model successfully retrived', 
            subscription: subscription});
    }catch(error){
        res.json({
            status: 400, 
            success: false,
            msg: 'Failed to get subscription Model', 
            errorMesage: error.errmsg});
    }
});

//getAllSubscriptionModels
router.get('/', async (req, res) => {
    try {
        const subscriptions = await Subscription.find().sort({monthlyPrice: 1});
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'All Subscription Model successfully retrived', 
            subscriptions: subscriptions});
    }catch(error){
        res.json({
            status: 400, 
            success: false,
            msg: 'Failed to get subscription Model', 
            errorMesage: error.errmsg});
    }
});

//deleteSubscriptionModel
router.delete('/:id', async (req, res) => {
try{
    const subscription = await Subscription.findById(req.params.id);
    if(!subscription) return res.json({status: 404, success: false, msg: 'Subscription Model with this Id can not be found'});
    const deletedSubscription = await Subscription.findByIdAndRemove(req.params.id);
    res.json({
        status: 200,
        success: true,
        msg: 'subscription successfully deleted',
        subscription: deletedSubscription
    });
}catch(error){
    res.json({
        status: 400,
        success: false,
        msg: 'Subscription deletion failed',
        errorMesage: error.errmsg
    });
}
});

module.exports = router;