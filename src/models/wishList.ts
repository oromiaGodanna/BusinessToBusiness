var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var wishlistSchema = new Schema({
    productIds: {type: [String],required:true},
    
});

function validateWishListProduct(product) {

    const wLProductS = {
        productIds: Joi.array().items(Joi.string()).required(),
      
    };

        
    return Joi.validate(product, wLProductS);
}

exports.WishList = mongoose.model("WishList", wishlistSchema);
exports.validateWishListProduct = validateWishListProduct;