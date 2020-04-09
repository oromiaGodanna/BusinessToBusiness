const mongoose = require('mongoose');
const Joi = require('joi');

let shippingAddress = new Object();

const Order = mongoose.model('Order', new mongoose.Schema({
    
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    prouctIds: {
        type: [ mongoose.Schema.Types.ObjectId ],
        required: true,
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
    },
    status: {
        type: String,
        required: true,
        Enum: ['Waiting for confirmation', 'Order canceled', 'Order Declined', 'Waiting for initial payment', 'Waiting for shipment', 'Waiting for final payment', 'Waiting for delivery', 'Waiting for delivery confirmation', 'Delivered', 'Completed']
    },
    PaymentIds: {
        type: [ mongoose.Schema.Types.ObjectId ],
        required: true,
    }
}))

function validateOrder(){
    const schema = {
        buyerId: Joi.objectId().required(),
        sellerId: Joi.objectId().required(),
        prouctIds: Joi.array().min(1).required(),
        amount: Joi.Number().required().integer().min(1),
        price: Joi.Number().required().positive(),
        shippingAddress: Joi.required(),
        status: Joi.String().required(),
        PaymentIds: Joi.array().required().allow(null)
        
    };

    return Joi.validate(Order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;