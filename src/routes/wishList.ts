import { ObjectId } from "bson";
import { userInfo } from "os";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Product = require('../models/product');
const WishList = require('../models/wishList');
//const User = require('../models/User');
//const mongoose = require('mongoose');

router.use(bodyParser.json());

router.use(function (req, res, next) {
  var token = {
    userId: "user121413",
    wishListId: "5e7743e73238d205bc571562",
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

router.post("/addToWishList", function (req, res) {
  var wishList = WishList();
  // wishList.wishListId = req.token.wishListId;
  wishList.productIds = req.body.productIds;

  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    Product.findOne({ _id: req.body.productIds }, function (err, productExist) {
      if (err) {
        throw err;
      }
      else if (productExist == null) {
        res.json({
          sucess: false,
          message: "Sorry,The product you wish to add to wishlist doesnot exist"
        });
      } else {

        WishList.findOne({ _id: req.token.wishListId }, function (err, wishL) {
          if (err) {
            throw err;
          }
          //res.send(wishList);
          else if (wishL == null) {
            console.log(wishL);
            wishList.save(function (err, createdWishList) {
              if (err) {
                res.json({ sucess: false, message: err });
              } else {
                /* User.updateOne({_id:req.token.userId},{$set:{wishListId:createdWishList._id}},function(err,User){
             if(err){
               throw err;
             }else{
              //update token too.
             }
           });*/
                res.json({ sucess: true, message: "product added to wishlist " + createdWishList });
              }
            });
          } else {

            if (wishL.productIds.includes(req.body.productIds)) {

              res.json({ sucess: true, message: "product already added to wishlist" });
            } else {

              WishList.updateOne({ _id: req.token.wishListId }, { $addToSet: { productIds: req.body.productIds } }, function (err, w) {
                if (err) {
                  res.json({ sucess: false, message: err });
                } else {
                  res.json({ sucess: true, message: "product added to wishlist" });
                }
                //res.redirect("/products");
              });
            }
          }
        })
      }
    });
  }
});


router.get("/getWishList", function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    WishList.findOne({ _id: req.token.wishListId }, function (err, wishListD) {
      if (err) {
        throw err;
      } else if (wishListD == null) {
        res.send("you have not added product to wishlist");
      } else {
        //res.send(prod);
        if (wishListD.productIds.length == 0) {
          res.send("No product is added to wishlist");
        } else {
          var productArray = [];
          for (let i = 0; i < wishListD.productIds.length; i++) {
            productArray.push(wishListD.productIds[i]);
          }

          Product.find({ _id: { $in: productArray } }, function (err, product) {
            if (err) {
              throw err;
            } else if (product == null) {

              res.send("no product found.");
            } else {
              // console.log(product);
              res.send(product);
            }
          });
        }
      }
      //res.send(wishListD);
    });
  }
});

router.get("/removeFromWishList/:id", function (req, res) {

  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    WishList.findOne({ _id: req.token.wishListId }, function (err, wishL) {
      if (err) {
        throw err;
      }else if(req.token.wishListId != wishL._id){
        res.send("you cannot delete product from wishlist");
      }else{
      WishList.updateOne({ _id: req.token.wishListId }, { $pull: { productIds: { $in: req.params.id } } }, function (err, product) {
        if (err) {
          res.json({ sucess: false, message: err });
        } else {
          res.json({ sucess: true, message: product + " product removed" });
        }
        //res.redirect("/products");
      })
    }
    })
  }
});


module.exports = router;
