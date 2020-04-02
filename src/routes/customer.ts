import {Request, Response} from "express";
const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
 

//Customer registeration
router.post('/register', async (req, res)=> {
    //validate - send 400 response if invalid
    const {error} = Customer.validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //create a new customer object
    let customer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyName: req.body.companyName,
        email : req.body.email,
        alternativeEmail: req.body.alternativeEmail,
        socialLinks : req.body.socialLinks,
        fax: req.body.fax,
        telephone: req.body.telephone,
        mobile: req.body.mobile,
        yearEstablished: req.body.yearEstablished,
        officalWebsite: req.body.officalWebsite,
        bussinesstype: req.body.bussinesstype,
        numOfEmployees : req.body.numOfEmployees,
        address: req.body.address,
        aboutUs: req.body.aboutUs,
        preferedCatagories : req.body.preferedCatagories,
        subscriptionType : req.body.subscriptionType,
        subscriptionCounter : req.body.subscriptionCounter,
        subscribedTo: req.body.subscribedTo,
        products: req.body.products,
        subscribers: req.body.subscribers,
        tin: req.body.tin,
        registredDate: req.body.registredDate,
        cartId: req.body.cartId,
        wishListId: req.body.wishListId,
        orderIds : req.body.wishListId,
        paymentId: req.body.paymentId
    });
    //register the new course
    try{
        const newCustomer = await customer.save();
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'Customer successfully registred', 
            customers: newCustomer});
    }catch(error){
        console.log(error);
        res.json({
            status: 400, 
            success: false, 
            msg: 'Failed to register Customer', 
            errorMesage: error.errmsg});
    }
});

//get All Customers
router.get('/', async(req, res) => {
    try {
        const customers = await Customer.find();
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'All Customers successfully retrived', 
            customers:customers});
    }catch(error){
        res.json({
            status: 400, 
            success: false,
            msg: 'Failed to register Customer', 
            errorMesage: error.errmsg});
    }
});

//get a Customer
router.get('/:id', async(req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer) return res.json({status: 404, success: false, msg: 'Customer with this Id can not be found'});
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'Customer successfully retrived', 
            customers:customer});
        }catch(error){
            console.log(error);
            res.json({
                status: 400, 
                success: false,
                msg: 'Customer retrival failed', 
                errorMesage: error.errmsg});
        }
        
});

//Edit a Customer
router.put('/:id', async(req, res) => {
    //validate - send 400 response if invalid
    //look up customer
    //if not exist,return 404
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id,req.body, {new: true});
        if(!updatedCustomer) return res.json({status: 404, success: false, msg: 'Customer with this Id can not be found'});
        res.json({ 
            status: 200, 
            success: true, 
            msg: 'Customer successfully Updated', 
            customers:updatedCustomer});
        }
    catch(error){
        console.log(error);
        res.json({
            status: 400, 
            success: false,
            msg: 'Customer Update failed', 
            errorMesage: error.errmsg});
    }
   
});
 
//delete Customer
router.delete('/:id', async(req, res) => {
    //lookup customer-if not exist,return 404
     try{
        const customer = await Customer.findById(req.params.id);
        console.log(customer);
        if(!customer) return res.json({status: 404, success: false, msg: 'Customer with this Id can not be found'});
       //check if deleting is allowed
       if(customer.orderIds.length > 0) return res.json({success: false, msg: 'Customer with this Id can not be deleted'});
       //delete customer 
       const deletedCustomer = await Customer.findByIdAndRemove(req.params.id);
       res.json({ 
           status: 200, 
           success: true, 
           msg: 'Customer successfully Updated', 
           customers:deletedCustomer});
     }
     catch(error){
         console.log(Error);
         res.json({
            status: 400, 
            success: false,
            msg: 'Customer deletion failed', 
            errorMesage: error.errmsg});
     }
   
});

//get Customer by filter
router.get('/:', async(req, res) => {

});

// //Autheneticate or login
// router.post('/authenticate', (req, res, next) => {
// });

// router.get('/profile/:id', (req,res,next) => {
//     res.send("returns user profile");
// });

// router.post('/profile/edit', (req,res,next) => {
//      //validate 
//     //if invalid , return 400 bad request
//     res.send("edit profile");
// });


//Api Endpoints
module.exports = router;