
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

function validateRating(rating){
    const schema = Joi.object({
        productId: Joi.objectId().required(),
        orderId: Joi.objectId().required(),
        userId: Joi.objectId().required(),
        rating: Joi.number().integer().min(1).max(5).required()
        
    });

    return  schema.validate(rating);
}

//  (async function(){
//     const rating = new Rating({
//         productId: '5d6ede6a0ba62570afcedd5a',
//         orderId: '5d6ede6a0ba62570afcedd3b',
//         userId: '5d6ede6a0ba62570afcedd3c',
//         rating: 3,
//      })
// const result = await rating.save();
// console.log(result)
//  })()
exports.Rating = Rating;
exports.validateRating = validateRating;