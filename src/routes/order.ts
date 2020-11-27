import { json } from "express";

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
        cartEntryId: req.body.cartEntryId,
        totalAmount: req.body.totalAmount,
        totalPrice: req.body.totalPrice,
        shippingAddress: req.body.shippingAddress,
        status: "Waiting for confirmation",
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
    // get orders for the given order ids
    const orders = await Order.find({
        '_id': { $in : req.body.orderIds}
    }, function(err, docs){ 
        if(err)
        console.log(err);
        
    });
    if (!orders) return res.status(404).send('No Order for the given product.');

    res.send({orders});
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
});
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
        {status: "Waiting for shipment"}, 
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
        {status: "Waiting for delivery confirmation"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})
router.put('/orderDelivered/:id', async (req, res) =>{
    //find order for the given id and update status
    const order = await Order.findByIdAndUpdate(req.params.id, 
        {status: "Delivered"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})

router.put('/closeOrderReceipt/:id', async (req, res) =>{
    //first check if dispute is not opened using this order ID
    
    //find order for the given id and update status
    const order = await Order.findByIdAndUpdate(req.params.id, 
        {status: "Completed"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send(order);
})

module.exports = router;