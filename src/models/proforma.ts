import { networkInterfaces } from "os";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');
//var customer = require('./customer');

var itemSchema = new Schema({
    //itemId:{type: mongoose.Schema.Types.ObjectId,required:true},
    proformaId: {type: mongoose.Schema.Types.ObjectId, ref: 'Proforma', required:true},
    category: {type: String, required:true},
    subCategory: String,
    //response: {type:[responseSchema],default:null},
    description: String,
    quantity:Number
       
});

var responseSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required:true},
    itemId:{type: mongoose.Schema.Types.ObjectId, ref: 'itemSchema', required:true},
    unitPrice:{type: Number,required:true},
});

var proformaSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required:true},
    items: {type:[itemSchema],default:null},
    startDate: {type:Date,default:null},
    endDate: {type:Date,default:null},
    maxResponse: {type:Number,default:10000000},
    response: {type:[responseSchema],default:null},
    createDate:{type:Date,default:Date.now()},
    status:{type:Boolean,default:false},
    closed:{type:Boolean,default:false}
    
});

function  validateItem(item){
    const schema = {
        items: Joi.array().items(Joi.object().keys({
            category: Joi.string().required(),
            subCategory: Joi.string().allow('').allow(null),
            description: Joi.string().allow('').allow(null),
            quantity: Joi.number(),
         }))
       
    };

    return Joi.validate(item, schema);
}

function  validateResponse(response){
    const schema = {
        itemId: Joi.string().required(),
        unitPrice:Joi.number().required(),
    };

    return Joi.validate(response, schema);
}

function  validateProforma(proforma){

    const schema = {
        startDate: Joi.date().allow('').allow(null),
        endDate: Joi.date().allow('').allow(null),
       items: Joi.array().items(Joi.object().keys({
            category: Joi.string().required(),
            subCategory: Joi.string().allow('').allow(null),
            description: Joi.string().allow('').allow(null),
            quantity: Joi.number(),
         })),
        maxResponse: Joi.number().allow('').allow(null),
    };

    return Joi.validate(proforma, schema);
}

exports.Proforma = mongoose.model("Proforma", proformaSchema);
exports.Item = mongoose.model("Item", itemSchema);
exports.Response = mongoose.model("Response", responseSchema);
exports.validateItem = validateItem;
exports.validateResponse = validateResponse;
exports.validateProforma = validateProforma;
