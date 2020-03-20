import { ObjectID } from "bson";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var additionalProductInfo = new Object;
// add constraints 
var productSchema = new Schema({
    userId : {type:String, required: true},
    specialOfferId:{type:String,default:null},
    productName:{type:String,required:true},
    productCategory:{type:String,required:true},
    productSubCategory:{type:String},
    description:{type:String},
    minOrder:{type:Number},
    price:{type:Number},
    keyword:{type:[String],required:true},
    images:[String],
    additionalProductInfo:{type:additionalProductInfo,required:true},
    createDate:{type:Date,default: Date.now()},
});

module.exports = mongoose.model("Product", productSchema);