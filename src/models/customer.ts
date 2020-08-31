const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const extendSchema = require('mongoose-extend-schema');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const moment = require('moment');


const {userSchema, joiUser, sendConfirmationEmail} = require('./user');

const customerSchema = extendSchema(userSchema, {
    alternativeEmail:String, 
    phoneNumbers: [String],
    address: {
        country: String,
        city: String,
        street: String,
    },
    companyName: String,
    tinNumber: {type:Number,
        //unique: true,
        required: [true, 'You have to provide your companies Tin number']
    },
    preferedCatagories:[{
        type: ObjectId, 
        ref: 'Catagory'
    }],
    orderIds: [{
        type: ObjectId, 
        ref: 'Order'
    }],              
    paymentId:{
        type:ObjectId, 
        ref: 'Payment'
    }
});

const Customer = mongoose.model('Customer', customerSchema, 'customers');

//buyer extends customer
const buyerSchema = extendSchema(customerSchema, {
    subscribedTo: [{
        type: ObjectId, 
        ref: 'Customer'
    }],
    cartId: {
        type:ObjectId, 
        ref: 'Cart'
    },
    wishListId: {
        type: ObjectId, 
        ref: 'Wishlist'
    },
});

const Buyer = mongoose.model('Buyer', buyerSchema, 'customers');

//seller extends customer
const sellerSchema = extendSchema(customerSchema, {
    SocialLinks: [String], 
    fax: String,
    yearEstablished: Number, 
    officalWebsite: String, 
    businessType: String,
    numOfEmployees: Number,
    aboutUs: String, 
    subscription: {         
        id : {
            type: ObjectId, 
            ref: 'Subscription'
        },
        startDate: Date,
        endDate: Date,
        counter: Number  //used and unused
    },
    products: [{
        type:ObjectId,
        ref: 'Product'
    }],
    subscribers: [{
        type: ObjectId, 
        ref: 'Customer'}]

});

const Seller = mongoose.model("Seller", sellerSchema, 'customers');

//both merges seller and buyer
const bothSchema = extendSchema(sellerSchema, {
    subscribers: [{
        type: ObjectId, 
        ref: 'Customer'}], 
    cartId: {
        type: ObjectId, 
        ref: 'Cart'
    },
    wishListId: {
        type: ObjectId, 
        ref: 'Wishlist'
    }
});

const Both = mongoose.model("Both", bothSchema, 'customers');

module.exports = {
    Customer: Customer,
    Buyer: Buyer,
    Seller: Seller,
    Both: Both
};

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//validations 

const joiCustomer = joiUser.keys({
    alternativeEmail:Joi.string().email(), 
    //phoneNumber: Joi.string().trim().regex(/^[0-9]{7,10}$/).required(),
    phoneNumbers: Joi.array().items(Joi.string().required().regex(/\s*(?:\+?(\d{1,3}))?[\W\D\s]^|()*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d[\W\D\s]*?\d)(?: *x(\d+))?\s*$/)),
    address: {
        country: Joi.string(),
        city: Joi.string(),
        street: Joi.string(),
    },
    companyName: Joi.string().required(),
    tinNumber: Joi.number().integer().required(),  
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
   
    SocialLinks: Joi.array().items(Joi.string().uri()).default(null), 
    fax: Joi.string(),
    yearEstablished: Joi.string().max(moment().year()),  
    officalWebsite: Joi.string().trim().uri(), 
    businessType: Joi.string(),
    numOfEmployees: Joi.number().integer().min(0),
    aboutUs: Joi.string(), 
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

// module.exports.getCustomerType = function(user){
//     if(user.userType == 'Buyer'){
//         return new Buyer(user);
//     }if (user.userType == 'Seller') {
//         return new Seller(user);
//     } else {
//         return undefined;
//     }
// }




