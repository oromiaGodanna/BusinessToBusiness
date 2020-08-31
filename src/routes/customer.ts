import { Request, Response } from "express";
const express = require('express');
const router = express.Router();
const bcyrpt = require('bcrypt');

const asyncMiddleware = require('../middleware/async'); 
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const jwt = require('jsonwebtoken');
const { Customer, Buyer, Seller, Both, validateCustomer, validateBuyer, validateSeller, validateBoth, getCustomerType } = require('../models/customer');
const { validateLoginInfo, generateAuthToken, sendConfirmationEmail, sendPasswordResetToken, validatePassword, validateEmail} = require('../models/user');


//using asyc middlerware
// router.get('/', asyncMiddleware(async(req, res) => {
// }));

//registration
router.post('/register', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findOne({ email: req.body.email });
    if (customer) return res.status(400).send('Customer with this email already exists.');
    const user = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userType: req.body.userType,
        password: req.body.password,
        alternativeEmail: req.body.alternativeEmail,
        phoneNumbers: req.body.phoneNumbers,
        address: req.body.address,
        companyName: req.body.companyName,
        tinNumber: req.body.tinNumber,
    }
    const salt = await bcyrpt.genSalt(10);
    user.password = await bcyrpt.hash(user.password, salt);
    if (user.userType == 'Buyer') {
        customer = new Buyer(user);
    } else if (user.userType == 'Seller') {
        customer = new Seller(user);
    } else if (user.userType == 'Both') {
        customer = new Both(user);
    } else {
        res.send('Undefind user type');
    };
    try {
        const newCustomer = await customer.save();
        //await sendConfirmationEmail(user);
        res.json({
            status: 200,
            success: true,
            msg: 'Customer successfully registerd. Confirmation email sent',
            customer: newCustomer
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            success: false,
            msg: "Failed to register customer",
            errorMessage: error.errmsg
        });
    }
});

//email Verification
router.post('/confirmation/:token', async (req, res) => {
    try {
        const user = jwt.verify(req.params.token, process.env.jwtPrivateKey);
        await Customer.findByIdAndUpdate(user.id, { verified: true }, { new: true });
        res.status(200).send("Email has been confirmed please process to the login page")
    } catch (err) {
        res.status(400).send('Email not confirmed ');
    }
});

router.post('/resend_Confirmation', async (req, res) => {
    let customer = await Customer.findOne({ email: req.body.email });
    const user = {
        id: customer.id,
        firstName: customer.firstName,
        email: req.body.email
    }
    try {
        await sendConfirmationEmail(user);
        res.status(200).send("Confirmation email sent");
    } catch (error) {
        res.status(400).send(error.errmsg);
    }
});

//Autheneticate or login
router.post('/login', async (req, res) => {
    const { error } = validateLoginInfo(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findOne({ email: req.body.email });
    if (!customer) return res.status(400).send('Invalid Email or password');
    //if(!customer.verified) return res.status(403).send('Unconfirmed Email Address. Please confirm Your email to Login');

    const validPassword = await bcyrpt.compare(req.body.password, customer.password);
    if (!validPassword) return res.status(400).send('Invalid Email or password');

    const token = generateAuthToken(customer);
    res.header('token', token).json({
        status: 200,
        token: token,
        msg: "Login Successfull"
    });
});

//get logged in Customer
router.get('/me', auth, async (req, res) => {
    const customer = await Customer.findById(req.user._id).select('-password');
    res.send(customer);
});

//retrive all customers
router.get('/', [auth, role], async (req, res) => {
    try {
        const customers = await Customer
        .find()
        .sort({companyName: 1})
        .select({password: 0});
        res.json({
            status: 200,
            success: true,
            msg: 'All customers successfully retrives',
            ObjectsReturned: customers.length,
            customers: customers
        });
    } catch (error) {
        res.json({
            status: 400,
            success: false,
            msg: 'Failes to retrive all customers',
            errorMessage: error.errmsg
        });
    }
});

//get customer by id
router.get('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.json({ status: 404, success: false, msg: 'Customer with this Id can not be found' });
        res.json({
            status: 200,
            success: true,
            msg: 'Customer retrived',
            task: customer
        });
    } catch (error) {
        console.log(Error);
        res.json({
            status: 400,
            success: false,
            msg: 'Customer retrival failed',
            errorMesage: error.errmsg
        });
    }
});

//get customers by a filter
router.get('/filter/:filters', async(req, res) => {
    const filter = JSON.parse(req.params.filters);
    try {
     const customers = await Customer
     .find(filter)
     .sort({companyName: 1})
     .select({password: 0});
     res.json({
         status: 200,
         success: true,
         msg: 'All customers with this property successfully retrives',
         ObjectsReturned: customers.length,
         customers: customers
        });
        } catch (error) {
            res.json({
                status: 500,
                success: false,
                msg: 'Failed to retrive customers with this property',
                errorMessage: error
            });
        }
});

//complete Profile
router.put('/completeProfile/:id', auth, async (req, res) => {
    if(req.body.userType == "Buyer"){
        const { error } = validateBuyer(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    }else if(req.body.userType == "Seller"){
        console.log('if seller');
        const { error } = validateSeller(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    }else if(req.body.userType = "Both"){
        const { error } = validateBoth(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    }
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) return res.json({ status: 404, success: false, msg: 'Customer with this Id can not be found' });
        res.json({
            status: 200,
            success: true,
            msg: 'Customer successfully Updated',
            customers: customer
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            success: false,
            msg: 'Customer Update failed',
            errorMesage: error.errmsg
        });
    }
});

//delete Customer
router.delete('/:id', [auth, role], async (req, res) => {
    //lookup customer-if not exist,return 404
    try {
        const customer = await Customer.findById(req.params.id);
        console.log(customer);
        if (!customer) return res.json({ status: 404, success: false, msg: 'Customer with this Id can not be found' });
        //check if deleting is allowed
        if (customer.orderIds.length > 0) return res.json({ success: false, msg: 'Customer with this Id can not be deleted' });
        //delete customer 
        const deletedCustomer = await Customer.findByIdAndRemove(req.params.id);
        res.json({
            status: 200,
            success: true,
            msg: 'Customer successfully Deleted',
            customers: deletedCustomer
        });
    }
    catch (error) {
        console.log(Error);
        res.json({
            status: 400,
            success: false,
            msg: 'Customer deletion failed',
            errorMesage: error.errmsg
        });
    }
});

//change Password
router.put('/changePassword/:id', auth, async (req, res)=>{
    const { error } = validatePassword(req.body.newPassword);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.json({ status: 404, success: false, msg: 'Customer with this Id can not be found' });
    const validPassword = await bcyrpt.compare(req.body.oldPassword, customer.password);
    if (!validPassword) return res.status(400).send('Invalid Email or password');
    try{
        const salt = await bcyrpt.genSalt(10);
        customer.password = await bcyrpt.hash(req.body.newPassword, salt);
        await customer.save()
        res.json({
            status: 200,
            success: true,
            msg: 'Password successfully Changed',
        });
    }catch(error){
        res.json({
            status: 400,
            success: false,
            msg: "Failed to change Password",
            errorMessage: error.errmsg});
    }  
});

//change email
router.put('/changeEmail/:id', auth, async(req, res)=>{
    const { error } = validateEmail(req.body.email);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.json({ status: 404, success: false, msg: 'Customer with this Id can not be found' });
    customer.set({
        email: req.body.email,
        verified: false,
    });
    try{
        await customer.save();
        await sendConfirmationEmail(customer);
        res.send("Confirmation email sent").json({
            status: 200,
            success: true,
            msg: 'email successfully changed',
        });
    }catch(error){
        res.json({
            status: 400,
            success: false,
            msg: "Failed to change email",
            errorMessage: error.errmsg
        });
    }
});

//subscribe 
router.put('/subscribe/:id', auth, async(req, res) => {
    try{
        const subscriber = await Buyer.findOneAndUpdate({_id:req.params.id}, { $addToSet: { 'subscribedTo': req.body.id }},{new: true});
        if (!subscriber) return res.json({ status: 404, success: false, msg: 'Customer with this Id can not be found' });

        const subscribed = await Seller.findOneAndUpdate({_id:req.body.id}, {$addToSet: {'subscribers': req.params.id }},{new: true});
        if (!subscribed) return res.json({ status: 404, success: false, msg: 'The Customer you are subscribing to can not be found' });
        res.json({
            status: 200,
            success: true,
            subscriber:subscriber,
            msg: `You have successfully subscribed to ${subscribed.companyName}.`,
            subscribed: subscribed
        });
    }catch(error){
        res.json({
            status: 400,
            success: false,
            msg: "Failed to subscribe customer",
            errorMessage: error.errmsg
        });
    }
});

//unsubscribe
router.put('/unsubscribe/:id', auth, async(req, res) => {
    try{
        const subscriber = await Buyer.findOneAndUpdate({_id:req.params.id}, { $pull: { 'subscribedTo': req.body.id }},{new: true});
        if (!subscriber) return res.json({ status: 404, success: false, msg: 'Customer with this Id can not be found' });

        const unsubscribed = await Seller.findOneAndUpdate({_id:req.body.id}, {$pull: {'subscribers': req.params.id }},{new: true});
        if (!unsubscribed) return res.json({ status: 404, success: false, msg: 'The Customer you are subscribing to can not be found' });
        res.json({
            status: 200,
            success: true,
            subscriber:subscriber,
            msg: `You have successfully subscribed to ${unsubscribed.companyName}.`,
            subscribed: unsubscribed
        });
    }catch(error){
        res.json({
            status: 400,
            success: false,
            msg: "Failed to subscribe customer",
            errorMessage: error.errmsg
        });
    }

});

//forgot Password
router.put('/forgotPassword', async(req, res)=>{
    const { error } = validateEmail(req.body.email);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findOne({ email: req.body.email });
    if (!customer) return res.status(400).send('No user found with that email address');
    try{
     const data = await sendPasswordResetToken(customer);
     console.log(data);
     res.json({
        status: 200,
        success: true,
        msg: `A link to reset you password has been sent to your email address ${req.body.email}`,
    });
} catch (error) {
    console.log(error);
    res.json({
        status: 400,
        success: false,
        msg: "Failed to register customer",
        errorMessage: error.errmsg
    });
}
});

router.put('/resetPassword/:token', async(req, res) => {
    const user = jwt.verify(req.params.token, process.env.jwtPrivateKey);
    const { error } = validatePassword(req.body.newPassword);
    if (error) return res.status(400).send(error.details[0].message);
    try{
        const salt = await bcyrpt.genSalt(10);
        user.password = await bcyrpt.hash(req.body.newPassword, salt);
        await user.save()
        res.json({
            status: 200,
            success: true,
            msg: 'Password has been reset successfully '
        });
        }catch(error){
            res.json({
                status: 400,
                success: false,
                msg: "Failed to rest Password",
                errorMessage: error.errmsg});
    } 
});


// //Edit a Customer
// router.put('/:id', async(req, res) => {
//     //validate - send 400 response if invalid
//     //look up customer
//     //if not exist,return 404
//     try {
//         const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id,req.body, {new: true});
//         if(!updatedCustomer) return res.json({status: 404, success: false, msg: 'Customer with this Id can not be found'});
//         res.json({ 
//             status: 200, 
//             success: true, 
//             msg: 'Customer successfully Updated', 
//             customers:updatedCustomer});
//         }
//     catch(error){
//         console.log(error);
//         res.json({
//             status: 400, 
//             success: false,
//             msg: 'Customer Update failed', 
//             errorMesage: error.errmsg});
//     }

// });

module.exports = router;




