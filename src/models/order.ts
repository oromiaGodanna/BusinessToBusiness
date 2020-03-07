const Joi = require('joi');
const mongoose = require('mongoose');

const Order = mongoose.model('Order', new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
    buyerId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    sellerId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    prouctIds: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    amount: {
        type: int,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    price: {
        type: Double,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    shippingAddress: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    status: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    PaymentIds: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
    
    

}))

function validateData(){

}

exports.Order = Order;