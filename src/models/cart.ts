var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var cartEntrySchema = new Schema({

    productId:{type:String,required:true},
    amount:{type:Number,required:true},
    additionalInfo:[String],
    
});

var cartSchema = new Schema({
    cartEntries:[cartEntrySchema]
    
});

function validateCartEntry(request){

    const schema = {
        amount: Joi.required().number().integer().min(0),
        price: Joi.number().required()
    }

    return Joi.validate(request, schema);
}

exports.Cart = mongoose.model("Cart", cartSchema);
exports.validateCart = validateCartEntry;
