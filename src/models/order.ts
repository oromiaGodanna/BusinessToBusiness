export {};
const mongoose = require('mongoose');
const Joi = require('joi');

mongoose.set('useFindAndModify', false);

let shippingAddress = new Object();
const orderStatus = ['Waiting for confirmation', 'Order canceled', 'Order Declined', 'Waiting for initial payment', 'Waiting for shipment', 'Waiting for final payment', 'Waiting for delivery confirmation', 'Delivered', 'Completed'];

const Order = mongoose.model('Order', new mongoose.Schema({
    
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    productIds: {
        type: [ mongoose.Schema.Types.ObjectId ],
        required: true,
        ref: 'Product'
    },
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        type: shippingAddress,
        required: true,
        default: {}
    },
    status: {
        type: String,
        enum: orderStatus,
        default: "Waiting for confirmation"
    },
    paymentIds: {
        type: [ mongoose.Schema.Types.ObjectId ],
        required: true,
    }
},  { minimize: false }))

function validateOrder(order){
    const schema = Joi.object({
        buyerId: Joi.objectId().required(),
        sellerId: Joi.objectId().required(),
        productIds: Joi.array().items(Joi.objectId()).min(1).required(),
        amount: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().precision(2).strict().required(),
        shippingAddress: Joi.object().allow(null).required(),
        status: Joi.string().valid(...orderStatus),
        paymentIds: Joi.array().items(Joi.objectId()).allow(null).required()
    });

    return schema.validate(order);
}

exports.Order = Order;
exports.validateOrder = validateOrder;