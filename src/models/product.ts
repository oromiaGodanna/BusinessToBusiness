import { ObjectID } from "bson";

var mongoose = require('mongoose');
var Joi = require('joi');
var Schema = mongoose.Schema;

var additionalProductInfo = new Object;
// add constraints 
var filterSchema = new Schema({
    productCategory:{type:String},
    productSubCategory:{type:String},
    minProductPrice:{type:String},
    maxProductPrice:{type:String},
    
});
const productSchema = new Schema({
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

function validateProduct(product) {

    const productS = {
        productName: Joi.string().required(),
        productCategory:Joi.string().required(),
        productPrice:Joi.number().required()
    };

        
    return Joi.validate(validateProduct, productS);
}

module.exports = mongoose.model("Product", productSchema);
module.exports = mongoose.model("Filter", filterSchema);
exports.validateProduct = validateProduct;