export {}
const mongoose = require('mongoose');
const Joi = require('joi');
const Review = mongoose.model('Review', new mongoose.Schema({
    
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
    review: {
        type: String,
        required: true,
    }
}))

function validateReview(review){
    const schema = Joi.object({
        productId: Joi.objectId().required(),
        userId: Joi.objectId().required(),
        orderId: Joi.objectId().required(),
        review: Joi.string().required()
        
    });

    return  schema.validate(review);
}

exports.Review = Review;
exports.validateReview = validateReview;