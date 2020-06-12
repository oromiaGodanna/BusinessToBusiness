export {};
const {Rating, validateRating} = require('../models/rating');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

function getOrderByID(){
    return {
        status: "complete"
    }
}


router.post('/addRating', async (req, res) => {

    //validate the request 
    const { error } = validateRating(req.body); 
    if (error) return res.status(400).send(error.details[0].message);


    //maybe check if the product exsist
    //const product = await Product.find({productId: req.body.productId});
    //if (!product) return res.status(400).send('Product doesn't exsist.');

    //check if user have a completed order for this product
    while( getOrderByID().status == "complete"){
        
            const rating = new Rating({ 
                productId: req.body.productId,
                orderId: req.body.orderId,
                userId: req.body.userId,
                rating: req.body.rating
              });
              await rating.save();
              
              res.send(rating);
    }

});



router.get('/getRating:id', async (req, res) => {

    //const rating = await Rating.find({productId: req.body.productId});
    const rating = [{ "_id" : Object("5e36e646b07fe088bcb23c60"), "name" : "John", "age" : 21, "location" : "New York" },
    { "_id" : Object("5e36e657b07fe088bcb23c62"), "name" : "John", "age" : 24, "location" : "Washington DC" },
    { "_id" : Object("5e36e66bb07fe088bcb23c63"), "name" : "John", "age" : 21, "location" : "Detroit" },
    { "_id" : Object("5e36e67bb07fe088bcb23c65"), "name" : "John", "age" : 29, "location" : "New York" }]
    const count = rating.length;



    for(let rating_value in rating){
        
    }

    if (!rating) return 0;
  
    res.send(rating);


});