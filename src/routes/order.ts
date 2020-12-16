import { json } from "express";
export {};
const { auth } = require('../middleware/auth');
const {Order, validateOrder} = require('../models/order');
const express = require('express');
const router = express.Router();

router.post('/createOrder', auth, async (req, res) => {

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



router.get('/getOrder/:id', auth,  async (req, res) => {
    //find order for the given id
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send('No Order for the given product.');

    res.send({order});


});
//get orders using buyer ID
router.get('/getBuyerOrders/:id', auth,  async (req, res) =>{
    // get orders for the given order ids
    // const orders = await Order.find({
    //     '_id': { $in : req.body.orderIds}
    // }, function(err, docs){ 
    //     if(err)
    //     console.log(err);
        
    // });
    const orders = await Order.find({buyerId: req.params.id})
    if (!orders) return res.status(404).send('No Order for the given product.');

    res.send({orders});
})

//get orders using supplier ID
router.get('/getSupplierOrders/:id', auth, async (req, res) =>{
    // get orders for the given order ids
    // const orders = await Order.find({
    //     '_id': { $in : req.body.orderIds}
    // }, function(err, docs){ 
    //     if(err)
    //     console.log(err);
        
    // });
    const orders = await Order.find({sellerId: req.params.id})

    if (!orders) return res.status(404).send('No Order for the given product.');
    console.log(orders);
    res.send({orders});
});

//accept order for suppliers
router.put('/acceptOrder/:id', auth,  async (req, res) =>{
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
router.put('/declineOrder/:id', auth, async (req, res) =>{
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
router.put('/cancelOrder/:id', auth, async (req, res) =>{
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
router.put('/changePaymentStatus/:id', auth, async (req, res) =>{
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
router.put('/changeShipmentStatus/:id', auth, async (req, res) =>{
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
router.put('/changeDeliveryStatus/:id', auth, async (req, res) =>{
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
router.put('/orderDelivered/:id', auth, async (req, res) =>{
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

router.put('/closeOrderReceipt/:id', auth, async (req, res) =>{
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