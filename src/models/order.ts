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
    cartEntryId: {
        type: [ mongoose.Schema.Types.ObjectId ],
        required: true,
        ref: 'Product'
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    totalPrice: {
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
        cartEntryId: Joi.array().required(),
        totalAmount: Joi.number().integer().min(1).required(),
        totalPrice: Joi.number().positive().required(),
        shippingAddress: Joi.object().allow(null).required(),
        status: Joi.string().valid(...orderStatus),
        paymentIds: Joi.array().items(Joi.objectId()).allow(null).required()
    });

    return schema.validate(order);
}

exports.Order = Order;
exports.validateOrder = validateOrder;