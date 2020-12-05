var mongoose = require('mongoose');
var Joi = require('joi');
var Schema = mongoose.Schema;

var additionalProductInfo = new Object;
// add constraints 
var filterSchema = new Schema({
    productCategory:{type:String},
    productSubCategory:{type:String,default:null},
    maxProductPrice:{type:Number},
    
});
const productSchema = new Schema({
    userId : {type:String, required: true},
    specialOfferId:{type:Schema.Types.ObjectId,default:null},
    productName:{type:String,required:true,minlength: 2,maxlength: 100},
    productCategory:{type:String,required:true},
    productSubCategory:{type:String,default:null},
    description:{type:String,default:null},
    minOrder:{type:Number,minlength:1},
    price:{type:Number,required:true},
    measurement:{type:String,default:null},
    keyword:{type:[String],default:null},
    images:[String],
    additionalProductInfo:{type:additionalProductInfo,default:null},
    //availablility:{type:Boolean,default:true},
    deleted:{type:Boolean,default:false},
    createDate:{type:Date,default: Date.now()},
});

function validateProducts(product) {

    const productS = {
        productName: Joi.string().required().max(150),
        productCategory:Joi.string().required(),
        productSubCategory: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        minOrder: Joi.number().min(50).optional(),
        price: Joi.number().required().min(1),
        keyword:Joi.array().items(Joi.string().allow(null, '')),
        images:Joi.array().items(Joi.string()),
        additionalProductInfo:Joi.allow(null, ''),
        measurement: Joi.string().allow(null, ''),
        
    };

        
    return Joi.validate(product, productS);
}

exports.Product = mongoose.model("Product", productSchema);
exports.Filter = mongoose.model("Filter", filterSchema);
exports.validateProduct = validateProducts;