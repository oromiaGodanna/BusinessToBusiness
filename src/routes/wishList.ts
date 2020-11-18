import { count } from "console";

export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var {Product} = require('../models/product');
var {WishList,validateWishListProduct} = require('../models/wishList');
//const User = require('../models/User');
//const mongoose = require('mongoose');

router.use(bodyParser.json());

router.use(function (req, res, next) {
  var token = {
    userId: "user121413",
    wishListId: "5fb16e5e53aee62d343fde60",
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

router.post("/addToWishList", async function (req, res) {
  var wishList = WishList();
  // wishList.wishListId = req.token.wishListId;
  wishList.productIds = req.body.productIds;

  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      success: false,
      message: "you must log in"
    });
  } else {

    const { error } = validateWishListProduct(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);

    } else {

    await Product.findOne({ _id: req.body.productIds }, async function (err, productExist) {
      if (err) {
        throw err;
      }
      else if (productExist == null) {
        res.json({
          success: false,
          type:false,
          message: "Sorry,The product you wish to add to wishlist doesnot exist"
        });
      } else {

       await WishList.findOne({ _id: req.token.wishListId }, async function (err, wishL) {
          if (err) {
            throw err;
          }
          //res.send(wishList);
          else if (wishL == null) {
           
           await wishList.save(function (err, createdWishList) {
              if (err) {
                res.json({ success: false,type:false,message: err });
              } else {
                /* User.updateOne({_id:req.token.userId},{$set:{wishListId:createdWishList._id}},function(err,User){
             if(err){
               throw err;
             }else{
              //update token too.
             }
           });*/
               // res.json({ sucess: true, message: "product added to wishlist " + createdWishList });
               res.json({ success: true,type:true,message: 'product added to wishlist' });
              }
            });
          } else {

            if (wishL.productIds.includes(req.body.productIds)) {

              res.json({ success: true,type:false, message: "product already added to wishlist" });
            } else {

             await WishList.updateOne(
               { _id: req.token.wishListId }, 
               { $addToSet: { productIds: req.body.productIds } 
              }, async function (err, w) {
                if (err) {
                  res.json({ success: false,type:false, message: err });
                } else {
                  res.json({ success: true,type:true, message: "product added to wishlist" });
                }
                //res.redirect("/products");
              });
            }
          }
        })
      }
    });
  }
  }
});

/*router.get("/getWishLists", async function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    await WishList.find({}, async function (err, wishListD) {
      res.send(wishListD);
    });
  }
});*/

router.get("/getWishList", async function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
   
    await WishList.findOne({ _id: req.token.wishListId }, async function (err, wishListD) {
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

          await Product.find({ _id: { $in: productArray } }, async function (err, product) {
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

router.delete("/removeFromWishList/:id", async function (req, res) {

  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    await WishList.findOne({ _id: req.token.wishListId }, async function (err, wishL) {
      if (err) {
        throw err;
      }else if(req.token.wishListId != wishL._id){
        res.send("you cannot delete product from wishlist");
      }else{
      await WishList.updateOne({ _id: req.token.wishListId }, { $pull: { productIds: { $in: req.params.id } } }, async function (err, product) {
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

router.get("/countProductInWishlist", async function (req, res) {

  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    await WishList.findOne({ _id: req.token.wishListId }, async function (err, wishL) {
      if (err) {
        throw err;
      }else if(wishL == null){
        res.send(String(0));
      }else{
        if(wishL != null){
          var products=wishL.productIds;
          var countProducts = products.length;
          //console.log(countProducts);
          res.send(String(countProducts));
        }else{
          //console.log(0);
          res.send(String(0));
        }
       
    }
    })
  }
});



module.exports = router;
