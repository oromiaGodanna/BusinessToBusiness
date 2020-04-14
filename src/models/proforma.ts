import { networkInterfaces } from "os";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');
//var customer = require('./customer');

var itemSchema = new Schema({
    //itemId:{type: mongoose.Schema.Types.ObjectId,required:true},
    proformaId: {type: mongoose.Schema.Types.ObjectId, ref: 'Proforma', required:true},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required:true},
    subCategory: {type: String, required:true},
    //response: {type:[responseSchema],default:null},
    description: String,
    quantity:Number
       
});

var responseSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required:true},
    itemId:{type: mongoose.Schema.Types.ObjectId, ref: 'itemSchema', required:true},
    unitPrice: Number
});

var proformaSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required:true},
    items: {type:[itemSchema],default:null},
    startDate: {type:Date,default:null},
    endDate: {type:Date,default:null},
    maxResponse: {type:Number},
    response: {type:[responseSchema],default:null},
    createDate:{type:Date,default:Date.now()},
    status:{type:Boolean,default:false}
    
});

function  validateItem(item){
    const schema = {
        proformaId: Joi.string().required(),
        categoryId: Joi.string().required(),
        subCategoryId: Joi.string().required(),
    };

    return Joi.validate(item, schema);
}

function  validateResponse(response){
    const schema = {
        userId: Joi.string().required(),
        itemId: Joi.string().required()
    };

    return Joi.validate(response, schema);
}


exports.Proforma = mongoose.model("Proforma", proformaSchema);
exports.Item = mongoose.model("Item", itemSchema);
exports.Response = mongoose.model("Response", responseSchema);
exports.validateItem = validateItem;
exports.validateResponse = validateResponse;
