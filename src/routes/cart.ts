import { ObjectId } from "bson";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Product = require('../models/product');
const Cart = require('../models/cart');
//const WishList = require('../models/wishList');
//const User = require('../models/User');
//const mongoose = require('mongoose');

router.use(bodyParser.json());

router.use(function (req, res, next) {
    var token = {
        userId: "user12143",
        cartId: "5e609e9a06cd2d1614e84d5e",
    };
        /*
            var token = req.body.token || req.body.query || req.headers['x-access-token'];
            if(token){
                // verify token
                jwt.verify(token, secret, function(err, decoded){
                    if(err){
                    res.json({sucess: false, message: "Token Invalid"});
                    }else{
                    req.decoded = decoded;
                    next();
                    }
                });
            }else{
                res.json({ sucess: false, message:"No Token was provided" });
            }        
        */;
    if (token) {
        req.token = token;
        next();
    } else {
        res.json({ sucess: false, message: "No Token was provided" });
    }
});

router.post("/addToCart", function (req, res) {
    var cart = Cart();
    //cart.cartId = req.token.cartId;

    if (req.token.userId == "" || req.token.userId == null) {
        res.json({
            sucess: false,
            message: "you must log in"
        });
    } else {
        Product.findOne({ _id: req.body.productId }, function (err, productExist) {
            if (err) {
                throw err;
            }
            else if (productExist == null) {
                res.json({
                    sucess: false,
                    message: "Sorry,The product you wish to add to cart doesnot exist"
                });
            } else {
                cart.cartEntries.productId = req.body.productId;
                cart.cartEntries.price = productExist.price;
                cart.cartEntries.amount = req.body.amount;

                Cart.findOne({ _id: req.token.cartId }, function (err, cartExistence) {
                    if (err) {
                        throw err;
                    }
                    //res.send(wishList);
                    else if (cartExistence == null) {
                        console.log(cartExistence);
                        cart.save(function (err, createdCart) {
                            if (err) {
                                res.json({ sucess: false, message: err });
                            } else {
                                /* User.updateOne({_id:req.token.userId},{$set:{cartId:createdCart._id}},function(err,User){
                             if(err){
                               throw err;
                             }else{
                              //update token too.
                             }
                           });*/
                                res.json({ sucess: true, message: "product added to cart " + createdCart });
                            }
                        });
                    } else {

                        var cartArray = [];
                        for (let i = 0; i < cartExistence.cartEntries.length; i++) {
                            cartArray.push(cartExistence.cartEntries[i].productId);
                        }

                        if (cartArray.includes(req.body.productId)) {

                            res.json({ sucess: true, message: "product already added to cart" });
                        } else {

                            Cart.updateOne({ _id: req.token.cartId }, { $addToSet: { cartEntries: { productId: req.body.productId, price: productExist.price, amount: req.body.amount } } }, function (err, c) {
                                if (err) {
                                    res.json({ sucess: false, message: err });
                                } else {
                                    res.json({ sucess: true, message: "product added to cart" });
                                }
                                //res.redirect("/products");
                            });
                        }
                    }
                })
            }
        })
    }
});

router.get("/getCart", function (req, res) {

    if (req.token.userId == "" || req.token.userId == null) {
        res.json({
            sucess: false,
            message: "you must log in"
        });
    } else {
        Cart.findOne({ _id: req.token.cartId }, function (err, cart) {
            if (err) {
                throw err;
            } else if (cart == null) {
                res.send("you have not added product to cart");
            } else {
                if (cart.cartEntries.length == 0) {
                    res.send("No product is added to cart");
                } else {
                    var productArray = [];
                    for (let i = 0; i < cart.cartEntries.length; i++) {
                        productArray.push(cart.cartEntries[i].productId);
                    }
                    Product.find({ productId: { $in: productArray } }, function (err, product) {
                        if (err) throw err;
                        // console.log(product);
                        res.send(cart);
                    });
                }
            }

            // res.send(cart);

        });
    }
});

router.get("/removeFromCart/:id", function (req, res) {

    if (req.token.userId == "" || req.token.userId == null) {
        res.json({
            sucess: false,
            message: "you must log in"
        });
    } else {

        Cart.findOne({ _id: req.token.cartId }, function (err, cartD) {
            if (err) {
                throw err;
            } else if (cartD == null) {
                res.send("you cannot delete product from cart");
            } else if (req.token.cartId != cartD._id) {
                res.send("you cannot delete product from cart");
            } else {
                Cart.updateOne({ _id: req.token.cartId }, { $pull: { cartEntries: { productId: { $in: req.params.id } } } }, function (err, productIncart) {
                    if (err) {
                        res.json({ sucess: false, message: err });
                    } else if (productIncart.nModified == 0) {
                        res.send("no product found to delete");
                    } else {
                        res.json({ sucess: true, message: productIncart });
                    }
                    //res.redirect("/products");
                })
            }
        })
    }
});

module.exports = router;