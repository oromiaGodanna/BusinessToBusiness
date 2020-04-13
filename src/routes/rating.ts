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

    //when order is created each product with the order ID is added to rating collection
    //same goes for review
    //maybe check if the product exsist
    //const rating = await Rating.find({productId: req.body.productId});

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
    
    
    
  

        
            
    
    //update the rating of that product with the given value

    // const { error } = validate(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);

    // let genre = new Genre({ name: req.body.name });
    // genre = await genre.save();

    // res.send(genre);
});


//get rating