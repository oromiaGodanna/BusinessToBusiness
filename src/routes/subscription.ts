export{};

const express = require('express');
const router = express.Router();

const Subscription = require('../models/subscription');
const { Customer, Seller, Both} = require('../models/customer');

//create Subscription Model
router.post('/create', async (req, res) => {
    const { error } = Subscription.validateSubscription(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let subscription = new Subscription({
        name: req.body.name,
        description: req.body.description,
        numOfProducts: req.body.numOfProducts,
        numOfQuatations: req.body.numOfQuatations,
        numOfEmails: req.body.numOfEmails,
        monthlyPrice: req.body.monthlyPrice,
        // availableOn : req.body.availableOn,
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
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid Id.');
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
            errorMessage: error.errmsg});
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
            errorMessage: error.errmsg});
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
        errorMessage: error.errmsg
    });
}
});

router.put('/buy/:subscriptionId', async(req, res) => {
    try{
        let customer = await Customer.findById(req.body.userId);
        console.log(customer);
        if(!customer) return res.json({status: 404, success: false, msg: 'Customer with this Id can not be found'});
        if(customer.userType == 'Buyer') return res.status(403).send('Subscription Models are  for Sellers Only');

        const subscription = await Subscription.findById(req.params.subscriptionId);
        if(!Subscription) return res.json({status: 404, success: false, msg: 'Subscription with this Id can not be found'});
       
        if (customer.userType == 'Seller') {
           customer = await Seller.findOneAndUpdate({ _id: req.body.userId }, { $set: { 
               'subscription.id': req.params.subscriptionId,
               'subscription. purchaseDate' : new Date(),
               'subscription.numOfProducts': subscription.numOfProducts,
               'subscription.numOfQuatations' : subscription.numOfQuatations,
               'subscription.numOfEmails' : subscription.numOfEmails

        }}, { new: true });
        }else if(customer.userType == 'Both') {
            customer = await Both.findOneAndUpdate({ _id: req.body.userId }, { $set: { 
                'subscription.id': req.params.subscriptionId,
                'subscription. purchaseDate' : new Date(),
                'subscription.numOfProducts': subscription.numOfProducts,
                'subscription.numOfQuatations' : subscription.numOfQuatations,
                'subscription.numOfEmails' : subscription.numOfEmails
            
            } }, { new: true });
        }
        res.json({
            status: 200,
            success: true,
            msg: 'subscription bought successfully',
            customer: customer
        });
    }catch(error){
        console.log(error);
        res.json({
            status: 400,
            success : false,
            errorMessage: "error"
        })
    }
});

module.exports = router;