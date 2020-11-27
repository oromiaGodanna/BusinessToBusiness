export {};
const {Review, validateReview} = require('../models/review');
const express = require('express');
const router = express.Router();

function getOrderByID(){
    return {
        status: "complete"
    }
}


router.post('/addReview', async (req, res) => {

    //validate the request 
    console.log(req.body)
    const { error } = validateReview(req.body); 
    if (error) return res.status(400).send(error.details[0].message);


    let review;
    //check if user have a completed order for this product
    if( getOrderByID().status == "complete"){
            review = new Review({ 
                productId: req.body.productId,
                orderId: req.body.orderId,
                userId: req.body.userId,
                review: req.body.review
              });
              review = await review.save();
              
    }

    res.send(review);

});



router.get('/getReview/:id', async (req, res) => {
    //find ratings for a specific product
    const review = await Review.find({productId: req.params.id})
    if (!review) return res.status(404).send('No rating for the given product.');

    res.send(review);


});
module.exports = router;