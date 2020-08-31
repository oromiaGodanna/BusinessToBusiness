import {Request, Response} from "express";
const express = require('express');
const router = express.Router();
const bcyrpt = require('bcrypt');

const {Admin, validateAdmin, validateLoginInfo, generateAuthToken} = require('../models/user');
 
//admin registration
router.post('/admin', async(req, res)=>{
    const {error} = validateAdmin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let admin = await Admin.findOne({email: req.body.email});
    if(admin) return res.status(400).send('Customer with this email already exists.');
    
    admin = new Admin({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userType: req.body.userType,
        password: req.body.password,
        title: req.body.title
    });
    const salt = await bcyrpt.genSalt(10);
    admin.password = await bcyrpt.hash(admin.password, salt);

    try{
        const newAdmin = await admin.save();
        res.json({
            status: 200,
            success: true,
            msg: 'Admin successfully created',
            admin: newAdmin});
    }catch(error){
        console.log(error);
        res.json({
            status: 400,
            success: false,
            msg: "Failed to create admin",
            errorMessage: error.errmsg
        });
    }
});

//admin login
router.post('/login', async(req, res) => {
    const { error } = validateLoginInfo(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let admin = await Admin.findOne({email: req.body.email});
    if(!admin) return res.status(400).send('Invalid Email or password');

    const validPassword = await bcyrpt.compare(req.body.password, admin.password);
    if(!validPassword) return res.status(400).send('Invalid Email or password');
    const token = generateAuthToken(admin);

    res.header('token', token).json({
        status: 200,
        token: token,
        msg:"Login Successfull"
    });
});

module.exports = router;













// router.post('/buyer', async(req, res)=>{
//     let buyer  = new Buyer({
//         email: "sth@gmail.com",
//         userType: "Buyer",
//         password: "sth",
//         firstName: "first",
//         lastName: "last"   
//     });
//     const newbuyer = await buyer.save();
//     res.send(newbuyer);
// });


// router.post('/seller', async(req, res)=>{
//     let seller = new Seller({
//         email: "sth@gmail.com",
//         userType: "seller",
//         password: "sth",
//         companyName: "name"
//     });
//     const newSeller = await seller.save();
//     res.send(newSeller);
// });
