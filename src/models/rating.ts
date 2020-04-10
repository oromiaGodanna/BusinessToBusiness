const mongoose = require('mongoose');
const Joi = require('joi');



const Rating = mongoose.model('Rating', new mongoose.Schema({
    
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }
    
    
}))

