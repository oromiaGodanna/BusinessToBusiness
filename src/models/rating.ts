
const mongoose = require('mongoose');
const Joi = require('joi');

const Rating = mongoose.model('Rating', new mongoose.Schema({
    
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    rating: {
        type: Number,
        required: true,
    }
    
    
}))

function validateRating(){
    const schema = {
        productId: Joi.objectId().required(),
        orderId: Joi.objectId().required(),
        userId: Joi.objectId.required(),
        rating: Joi.Number().integer().min(1).max(5).required()
        
        
    };

    return Joi.validate(Rating, schema);
}

exports.Rating = Rating;
exports.validateOrder = validateRating;