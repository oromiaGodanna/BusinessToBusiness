const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const customerSchema = new Schema({
   firstName: String,
   lastName: String,
   companyName: {
       type: String,
       unique: true,
       required: [true, 'Company Name should be Provided']
   },
   email: {
       type: String,
       unique: true,
       required: [true, 'Emial address is required']
   },
   alternativeEmail:String,
   SocialLinks: [String],
   fax: String,
   telephone: String,
   mobile: String,
   yearEstablished: String,
   businessType: String,
   numOfEmployees: Number,
   address: String,
   aboutUs: String,
   preferedCatagories: [String],
   subscriptionType: String,
   subscriptionCounter: String,
   subscribedTo: [String],
   products: [String],
   subscribers: [String],
   tin: {
       type:Number,
       unique: true,
       required: [true, 'You have to provide your companies Tin number']
       
   },
   registeredDate: Date,
   cartId: String,
   wishList: String,
   orderIds: [String],
   paymentId: String,
   password: {
       type: String,
       require: [true, 'Password Required']
   },
   userType:String,
     
});

const customer = mongoose.model('customer', customerSchema);
module.exports = customer;


module.exports.register = function(newCustomer){
    return String;
};

module.exports.editCustomer = function(customerId: String,newCustomer){
    return customer;
};

module.exports.getCustomer = function (customerId: String){
    return customer;
};

module.exports.deactivateAccount = function (){};

module.exports.getAllCustomers = function (){};

module.exports.getCusotmerByFilter = function (){};

module.exports.upgradeSubscriptionModel = function (){};

module.exports.subscribeBuyer = function (){
    return String
};

module.exports.unsubscribe = function (userId: String){};





