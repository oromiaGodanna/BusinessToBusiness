import { Schema } from "mongoose";

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const extendSchema = require('mongoose-extend-schema');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const moment = require('moment');


const {userSchema, joiUser, sendConfirmationEmail} = require('./user');

const customerSchema = extendSchema(userSchema, {
    alternativeEmail:{
        type:String, 
        default: null
    },
    mobile: String,
    telephone: {
        type: String,
        default: null
    },
    companyName: String,
    tinNumber: {
        type:Number,
        //unique: true,
        required: [true, 'You have to provide your company Tin number']
    },
    joined: {
        type: String,
    },
    preferedCatagories:[{
        type: ObjectId, 
        ref: 'Catagory',
        default: null
    }],
    orderIds: [{
        type: ObjectId, 
        ref: 'Order',
        default: null,
    }],              
    paymentId:{
        type:ObjectId, 
        ref: 'Payment',
        default: null
    }
});

const Customer = mongoose.model('Customer', customerSchema, 'customers');

//buyer extends customer
const buyerSchema = extendSchema(customerSchema, {
    subscribedTo: [{
        type: ObjectId, 
        ref: 'Customer',
        default: null
    }],
    cartId: {
        type:ObjectId, 
        ref: 'Cart',
        default: null
    },
    wishListId: {
        type: ObjectId, 
        ref: 'Wishlist',
        default: null
    },
});

const Buyer = mongoose.model('Buyer', buyerSchema, 'customers');

//seller extends customer
const sellerSchema = extendSchema(customerSchema, {
    address : {
        type: String,
        default: null
    },
    socialLinks: {
        facebook: {
            type: String,
            default: null
        },
        twitter:{
            type: String,
            default: null
        },
        instagram: {
            type: String,
            default: null
        },
        linkedin: {
            type: String,
            default: null
        },
    }, 
    fax: {
        type: String,
        default: null
    },
    yearEstablished: {
        type: Date, 
        default: new Date().getFullYear()
    },
    officalWebsite: {
        type: String,
        default: null
    }, 
    businessType: {
        type: String,
        default: null
    },
    numOfEmployees: {
        type:Number,
        default: null
    },
    aboutUs: {
        type: String, 
        default: null
    },
    subscription: {     
        // type: ObjectId, 
        // ref: 'Subscription',
        // default: null 
        id : {
            type: ObjectId, 
            ref: 'Subscription',
            default: null
        },
        purchaseDate: {
            type: Date,
            default: null,
        },
        numOfProducts: {
            type: Number,
            default: 0
        },
        numOfQuatations:{
            type: Number,
            default: 0,
        },
        numOfEmails:{
            type: Number,
            default: 0
        }
    },
    products: [{
        type:ObjectId,
        ref: 'Product',
        default: null
    }],
    subscribers: [{
        type: ObjectId, 
        ref: 'Customer',
        default: null
}]

});

const Seller = mongoose.model("Seller", sellerSchema, 'customers');

//both merges seller and buyer
const bothSchema = extendSchema(sellerSchema, {
    subscribers: [{
        type: ObjectId, 
        ref: 'Customer',
        default: null
    }], 
    cartId: {
        type: ObjectId, 
        ref: 'Cart',
        default: null
    },
    wishListId: {
        type: ObjectId, 
        ref: 'Wishlist',
        default: null
    }
});

const Both = mongoose.model("Both", bothSchema, 'customers');

const deleteRequestSchema = new Schema({
    name : {
        type: String,
        required: true,
    }, 
    email : {
        type: String,
        required: true
    },
    reason : {
        type: String,
        required: true
    },
    message: String,
    user: {
        type: ObjectId,
        ref: 'Customer'
    },
});
const DeleteRequest = mongoose.model('DeleteRequest', deleteRequestSchema);


module.exports = {
    Customer: Customer,
    Buyer: Buyer,
    Seller: Seller,
    Both: Both,
    DeleteRequest: DeleteRequest
};

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//validations 
const joiCustomer = joiUser.keys({
    alternativeEmail: Joi.alternatives().try(Joi.string().email().lowercase(), Joi.valid(null)), 
   mobile: Joi.string().regex(new RegExp("^((\\+91-?)|0)?[0-9]{10}$")).required(),
   telephone: Joi.alternatives().try(Joi.string().regex(new RegExp("^((\\+91-?)|0)?[0-9]{10}$")), Joi.valid(null)),
    companyName: Joi.string().required(),
    tinNumber: Joi.number().integer().min(10).required(), 
    joined: Joi.string().max(moment().year()), 
    preferedCatagories: Joi.array().items(Joi.objectId()).default(null),  
    orderIds: Joi.array().items(Joi.objectId()).default(null),            
    paymentId: Joi.objectId().default(null),                             
});

const joiBuyer = joiCustomer.keys({
    subscribedTo: Joi.array().items(Joi.objectId()).default(null),        
    cartId: Joi.objectId().default(null),
    wishListId: Joi.objectId().default(null)
});

const joiSeller = joiCustomer.keys({
    address: Joi.alternatives().try(Joi.string().required(),Joi.valid(null)),
    socialLinks: {
        facebook: Joi.alternatives().try(Joi.string().uri(),Joi.valid(null)),
        twitter: Joi.alternatives().try(Joi.string().uri(),Joi.valid(null)),
        instagram: Joi.alternatives().try(Joi.string().uri(),Joi.valid(null)),
        linkedin: Joi.alternatives().try(Joi.string().uri(),Joi.valid(null)),
    },
    fax: Joi.alternatives().try(Joi.string(),Joi.valid(null)),
    yearEstablished: Joi.alternatives().try(Joi.date(),Joi.valid(null)), 
    officalWebsite: Joi.alternatives().try(Joi.string().trim().uri(),Joi.valid(null)),  
    businessType: Joi.alternatives().try(Joi.string(), Joi.valid(null)),
    numOfEmployees: Joi.alternatives().try(Joi.number().integer().min(0),Joi.valid(null)),
    aboutUs: Joi.alternatives().try(Joi.string(), Joi.valid(null)),  
    subscription: {         
        id : Joi.objectId(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        counter: Joi.number().integer(),  //used and unused
    },
    products: Joi.array().items(Joi.objectId()).default(null),                   
    subscribers: Joi.array().items(Joi.objectId()).default(null),   
});

const joiBoth = joiSeller.concat(joiBuyer);

module.exports.validateCustomer =  function(customer){
    return Joi.validate(customer, joiCustomer);
}

module.exports.validateBuyer = function(buyer){
    return Joi.validate(buyer, joiBuyer);
};

module.exports.validateSeller = function(seller){
    return Joi.validate(seller, joiSeller);
};
module.exports.validateBoth = function(both){
    return Joi.validate(both, joiBoth);
}

module.exports.validateDeleteRequest = function(request){
    const deleteRequest = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().trim().email().required().lowercase(),
        reason: Joi.string().required(),
        message: Joi.alternatives().try(Joi.string(), Joi.valid(null)), 
        user: Joi.objectId().default(null), 
    });
    return deleteRequest.validate(request)
}




