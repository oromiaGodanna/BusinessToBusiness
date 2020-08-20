export {};
const {Rating, validateRating} = require('../models/rating');
const express = require('express');
const router = express.Router();

function getOrderByID(){
    return {
        status: "complete"
    }
}


router.post('/addRating', async (req, res) => {

    //validate the request 
    console.log(req.body)
    const { error } = validateRating(req.body); 
    if (error) return res.status(400).send(error.details[0].message);


    let rating;
    //check if user have a completed order for this product
    if( getOrderByID().status !== "complete"){
            rating = new Rating({ 
                productId: req.body.productId,
                orderId: req.body.orderId,
                userId: req.body.userId,
                rating: req.body.rating
              });
              rating = await rating.save();
              
    }

    res.send(rating);

});



router.get('/getRating:id', async (req, res) => {
    //find ratings for a specific product
    const allRatings = await Rating.find({productId: req.params.id})
    if (!allRatings) return res.status(404).send('No rating for the given product.');

    //iterate through each and return total rating value
    let rating = 0; let ratingsCount = allRatings.length;
    for(let i of allRatings){
        rating += i.rating;
    }
    //find the average 
    rating /= ratingsCount;

    res.send({rating});


});
module.exports = router;