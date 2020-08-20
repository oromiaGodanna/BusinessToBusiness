export {};
const {Order, validateOrder} = require('../models/order');
const express = require('express');
const router = express.Router();

router.post('/createOrder', async (req, res) => {

    //validate the request 
    const { error } = validateOrder(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let order = new Order({ 
        buyerId: req.body.buyerId,
        sellerId: req.body.sellerId,
        productIds: req.body.productIds,
        amount: req.body.amount,
        price: req.body.price,
        shippingAddress: req.body.shippingAddress,
        status: req.body.status,
        paymentIds: req.body.paymentIds,
    });
    order = await order.save();
    res.send(order);

});



router.get('/getOrder/:id', async (req, res) => {
    //find order for the given id
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send({order});


});

router.get('/getOrders', async (req, res) =>{

})
router.put('/acceptOrder/:id', async (req, res) =>{
    //find order for the given id and update status
    const order = await Order.findByIdAndUpdate(req.params.id, 
        {status: "Waiting for initial payment"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})
router.put('/declineOrder/:id', async (req, res) =>{
    //find order for the given id and update status
    const order = await Order.findByIdAndUpdate(req.params.id, 
        {status: "Order Declined"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})
router.put('/cancelOrder/:id', async (req, res) =>{
    //find order for the given id and update status
    const order = await Order.findByIdAndUpdate(req.params.id, 
        {status: "Order canceled"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})
router.put('/changePaymentStatus/:id', async (req, res) =>{
    //find order for the given id and update status
    const order = await Order.findByIdAndUpdate(req.params.id, 
        {status: "Waiting for final payment"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})
router.put('/changeShipmentStatus/:id', async (req, res) =>{
    //find order for the given id and update status
    const order = await Order.findByIdAndUpdate(req.params.id, 
        {status: "Waiting for initial payment"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})
router.put('/changeDeliveryStatus/:id', async (req, res) =>{
    //find order for the given id and update status
    const order = await Order.findByIdAndUpdate(req.params.id, 
        {status: "Waiting for initial payment"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})
router.put('/openDispute/:id', async (req, res) =>{

})
router.put('/closeOrderReceipt/:id', async (req, res) =>{

})
router.put('/addPaymentId/:id', async (req, res) =>{
    //find order for the given id and update status
    const order = await Order.updateOne({_id: req.params.id}, { $push: { 'paymentIds':  req.params.id}});
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})
module.exports = router;