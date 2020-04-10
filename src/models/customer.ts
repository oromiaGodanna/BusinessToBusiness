const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const customerSchema = new Schema({
   firstName: {
       type: String,
       required: [true, 'First name is required']
    },
    lastName: {
       type: String,
       required : [true, 'Last Name is required']
    },
    companyName: {
       type: String,
       required: [true, 'Company Name is required'],
       unique: true
    },
    email: {             
       type: String,
       required: [true, 'Email address is required'],
       unique: true,
   },
   alternativeEmail:String, 
   SocialLinks: [String], 
   fax: String,
   telephone: String, 
   mobile: String, 
   yearEstablished: Number, 
   officalWebsite: String, 
   businessType: String,
   numOfEmployees: Number,
   address: {
       country: String,
       city: String,
       street: String,
   },
   aboutUs: String, 
   preferedCatagories: [String], //[Schema.Types.ObjectId
   subscriptionType: String,  //Schema.Types.ObjectId,
   subscriptionCounter: String,      //Schema.Types.ObjectId,
   subscribedTo: [String],             //[Schema.Types.ObjectId],
   products: [String],                   //[Schema.Types.ObjectId],
   subscribers: [String],                  //[Schema.Types.ObjectId],
   tin: {
       type:Number,
       unique: true,
       required: [true, 'You have to provide your companies Tin number']
   },
   registeredDate: {
       type: Date,
       default: Date.now()
   },
   cartId: String,
   wishListId: String,       //Schema.Types.ObjectId,
   orderIds: [String],       //[Schema.Types.ObjectId],
   paymentId: String,
});

const Customer = mongoose.model('Customer',customerSchema);
module.exports = Customer;

module.exports.validateCustomer = function(customer){
    const schema = {
        firstName: Joi.string().required(),
        lastName : Joi.string().required(),
        companyName: Joi.string().required(),
        email: Joi.string().trim().email().required(),
        alternativeEmail:Joi.string().trim().email().allow('').optional(), 
        SocialLinks: Joi.array().items(Joi.string()).optional(), 
        fax: Joi.string().optional(),
        telephone: Joi.string().regex(/\s*(?:\+?(\d{1,3}))?[\W\D\s]^|()*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d[\W\D\s]*?\d)(?: *x(\d+))?\s*$/).required(), 
        mobile: Joi.string().regex(/\s*(?:\+?(\d{1,3}))?[\W\D\s]^|()*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d[\W\D\s]*?\d)(?: *x(\d+))?\s*$/).optional(),
        yearEstablished: Joi.number().integer().max(2020), 
        officalWebsite: Joi.string().trim().uri().optional(), 
        businessType: Joi.string(),
        numOfEmployees: Joi.number().integer().min(0),
        address: {
            country: Joi.string(),
            city: Joi.string(),
            street: Joi.string()
        },
        aboutUs: Joi.string().length(100),
        preferedCatagories: Joi.array().items(Joi.string()).default(null),
        subscriptionType: Joi.string().default(null), 
        subscriptionCounter: Joi.string().default(null),      
        subscribedTo: Joi.array().items(Joi.string()).default(null),             
        products: Joi.array().items(Joi.string()).default(null),                   
        subscribers: Joi.array().items(Joi.string()).default(null),                  
        tin: Joi.number().integer().required(),
        registeredDate: Joi.date(),
        cartId: Joi.string().default(null),
        wishListId: Joi.string().default(null),      
        orderIds: Joi.array().items(Joi.string()).default(null),       
        paymentId: Joi.string().default(null)
    };
    return Joi.validate(customer, schema);
};





