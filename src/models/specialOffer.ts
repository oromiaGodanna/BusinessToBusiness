var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var specialOfferSchema = new Schema({
    specialOfferId : {type:String, required: true},
    productId: {type:String, required: true},
    title:String,
    startDate:{type:Date},
    endDate:{type:Date},
    discount:Number,
    status:{type:Boolean,default:false}   
});



module.exports = mongoose.model("SpecialOfferSchema", specialOfferSchema);
