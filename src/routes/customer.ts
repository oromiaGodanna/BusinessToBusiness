import {Request, Response} from "express";
const express = require('express');
const router = express.Router();


const Customer = require('../models/customer');


//register
router.post('/register', (req, res, next)=> {
    let newCustomer = new Customer({
        //firstName: req.body.firstName
    });
});

//Autheneticate or login
router.post('/authenticate', (req, res, next) => {

});

router.get('/profile', (req,res,next) => {
    res.send("returns user profile");
});

router.post('/profile/edit', (req,res,next) => {
    res.send("edit profile");
});


//Api Endpoints

module.exports = router;