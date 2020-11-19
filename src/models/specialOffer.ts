var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var specialOfferSchema = new Schema({
    userId : {type:String, required: true},
    productId: {type:Schema.Types.ObjectId, required: true, ref:'Product'},
    title:String,
    startDate:{type:Date,default:null},
    endDate:{type:Date,default:null},
    discount:Number,
    status:{type:Boolean,default:false}   
});

function validateSpecialOffer(specialO) {

    const specialOfferS = {
        productId:Joi.string().required(),
        title: Joi.string().allow(null, ''),
        startDate: Joi.date().allow(null, ''),
        endDate: Joi.date().allow(null, ''),
        discount: Joi.number().required(),
        status:Joi.boolean().optional()
        
    };

        
    return Joi.validate(specialO, specialOfferS);
}

exports.SpecialOffer = mongoose.model("SpecialOffer", specialOfferSchema);
exports.validateSpecialOffer = validateSpecialOffer;