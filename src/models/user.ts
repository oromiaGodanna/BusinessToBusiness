export{};
const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const Schema = mongoose.Schema;
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
//const passwordComplexity = require('joi-password-complexity');
const moment = require('moment');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
//var sgTransport = require('nodemailer-sendgrid-transport');

var userSchema = new Schema({
    email: {             
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    firstName: String,
    lastName: String,
    password: String,
    userType: {
        type: String,
        default: "Admin",
        enum: ['Admin', 'Buyer', 'Seller', 'Both']
       
    },
    registeredDate: {
        type: Date,
        default: new Date()
    }
});

//admin extends user
const adminSchema = extendSchema(userSchema, {
    title: String,
});

const Admin = mongoose.model('Admin', adminSchema);

// const complexityOptions = {
//     min: 5,
//     max: 255,
//     lowerCase: 1,
//     upperCase: 2,
//     numeric: 2,
//     symbol: 1,
//     requirementCount: 4 
//     /* 
//        Min & Max not considered in the count. 
//        Only lower, upper, numeric and symbol. 
//        requirementCount could be from 1 to 4 
//        If requirementCount=0, then it takes count as 4
//    */
// };
//password: PasswordComplexity(complexityOptions).required();

const joiUser = Joi.object({
    email: Joi.string().trim().email().lowercase().when('verified', {is: false, then: Joi.optional(), otherwise: Joi.required()}),
    verified: Joi.boolean().default(false),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userType: Joi.string().valid('Admin', 'Buyer', 'Seller', 'Both').default('Admin'),
    password: Joi.string().regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")).when('verified', {is: false, then: Joi.optional(), otherwise: Joi.required()}),
    // password: new PasswordComplexity({
    //     min: 8, max: 25, lowerCase: 1, upperCase: 1, numeric: 1, requirementCount: 3}).when('verified', {is: false, then: Joi.optional(), otherwise: Joi.required()}),
    //registeredDate: Joi.date().default(moment().format('MMM DD YYYY')),
});


module.exports = {
    Admin: Admin,
    userSchema: userSchema,
    joiUser: joiUser
};

//functions
module.exports.validateAdmin = function(admin){
    const joiAdmin = joiUser.keys({
        title: Joi.string()
    });
    return joiAdmin.validate(admin);
};

module.exports.validateLoginInfo = function(info){
    const loginInfo = Joi.object({
        email: Joi.string().trim().email().lowercase().required(),
        password: Joi.string().required()
});
        return loginInfo.validate(info);
};

module.exports.generateAuthToken = function(user){
    const token = jwt.sign(
        {_id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        userType: user.userType,
        wishListId: user.wishListId,
        cartId: user.cartId}, 
        process.env.jwtPrivateKey
        );
        return token;
};

const transport = nodemailer.createTransport(nodemailerSendgrid({
    apiKey: process.env.sendGridApiKey
}));
 
module.exports.sendConfirmationEmail = function(user){
    const token = jwt.sign(
        {_id: user.id,  
        email: user.email, 
        },process.env.jwtPrivateKey);

        const url = `localhost:4200/email_confirmation/${token}`
        return transport.sendMail({
        from: 'Tamenemihret@gmail.com',
        to: `${user.firstName} <${user.email}>`,
        subject: 'Confirmation Email',
        html: `Copy and paste the link below to confirm Your email.<a href=${url}>${url}</a> If you did not request this, please ignore this email.`

    });
    return token;
}

module.exports.sendPasswordResetToken = function(user){
    console.log("Send Password rest token");
    const token = jwt.sign(
        {_id: user.id,  
        email: user.email, 
        },process.env.jwtPrivateKey);

        const url = `localhost:4200/reset_password/${token}`
      
        transport.sendMail({
        from: 'Tamenemihret@gmail.com',
        to: `${user.firstName} <${user.email}>`,
        subject: 'B2B Password Reset',
        //html: `confirm Your email by clicking the following link. <a href=${url}>${url}</a>`
        html: `You are receiving this because you (or someone else) have requested to reset of the password for your account.<br>
        Please click on the link below, or paste this into your browser to complete the process:<br>
        <a href=${url}>${url}</a> <br>
        If you did not request this, please ignore this email and your password will remain unchanged.`
   });
   return token;
}
module.exports.validatePassword = function(password){
    return Joi.validate(password, new PasswordComplexity({
        min: 8, max: 25, lowerCase: 1, upperCase: 1, numeric: 1,  requirementCount: 3}).required());
}

module.exports.validateEmail = function(email){
    return Joi.validate(email, Joi.string().trim().email().required());
}

module.exports.validatePhoneNumber = function(phoneNumber){
    return Joi.validate(phoneNumber, Joi.string().trim().regex(new RegExp("^((\\+91-?)|0)?[0-9]{10}$")).required());
}


 // var options = {
    //     auth: {
    //       api_user: 'SENDGRID_USERNAME',  
    //       api_key: process.env.sendGridApiKey
    //     }
    //   } 
    // var email = {
    //     from: 'Tamenemihret@gmail.com',
    //     to: user.email,
    //     subject: 'Confirm Your email address',
    //     html: '<b>By clicking on the following link, you are confirming your email address.</b>'
    //   };