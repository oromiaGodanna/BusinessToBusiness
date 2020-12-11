
import { isNumber } from "util";

export {};

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {WishList,validateWishListProduct} = require('../models/wishList');
const { Product, Filter, validateProduct } = require('../models/product');
const mongoose = require('mongoose');
const { Customer, Buyer, Seller, Both,  DeleteRequest, validateCustomer, validateBuyer, validateSeller, validateBoth, validateDeleteRequest } = require('../models/customer');//const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

router.use(bodyParser.json());


/*router.get("/check",auth, async function (req, res) {
    
    var customer = await Customer.findOne({ _id: req.user._id }).select('wishListId');
    res.send(req.user);
});*/


router.post("/addToWishList",auth, async function (req, res) {
    
  if (req.body.productIds == null ) {
    return res.status(400).json({ success: false,type:false,message: 'Invalid product Id.' });
    
  }

  var wishList = WishList();
  // wishList.wishListId = req.token.wishListId;
  wishList.productIds = req.body.productIds;

  

  if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
    res.status(401).json({
      success: false,
      message: "you must log in and you must be either customer or both"
    });
  } else {

    const { error } = validateWishListProduct(req.body);
   

    await Product.findOne({ _id: req.body.productIds }, async function (err, productExist) {
      if (err) {
        throw err;
      }
      else if (productExist == null) {
        res.status(404).json({
          success: false,
          type:false,
          message: "Sorry,The product you wish to add to wishlist doesnot exist"
        });
      } else {


       const customer = await Buyer.findOne({ _id: req.user._id }).select('wishListId');
        /*var customer = {
          wishListId:"5fc006f71ebba134c80c9e89"
        };*/

       await WishList.findOne({ _id: customer.wishListId }, async function (err, wishL) {
           //console.log(wishL);
          if (err) {
            throw err;
          }
          //res.send(wishList);
          else if (wishL == null) {
           
           await wishList.save(function (err, createdWishList) {
              if (err) {
                res.status(500).json({ success: false,type:false,message: err });
              } else {

              //Buyer.updateOne({_id:req.user._id},{$set:{wishListId:createdWishList._id}});
               //console.log(createdWishList._id);
                Buyer.updateOne({ _id:req.user._id }, {

                  $set: {
                      wishListId : createdWishList._id
                  }
                }, function (err, productD) {
                  if (err) {
                    res.status(500).json({ success: false,type:false,message: err });
                  }
                  else{
                    res.status(200).json({ success: true,type:true,message: 'product added to wishlist' });
                     console.log("product Added For the First time");
                  } 
                });

              }
            });
          } else {

            if (wishL.productIds.includes(req.body.productIds)) {

              res.status(200).json({ success: true,type:false, message: "product already added to wishlist" });
               console.log("product already added to wishlist");
            } else {

             await WishList.updateOne(
               { _id: customer.wishListId }, 
               { $addToSet: { productIds: req.body.productIds } 
              }, async function (err, w) {
                if (err) {
                  res.status(400).json({ success: false,type:false, message: err });
                } else {
                  res.status(200).json({ success: true,type:true, message: "Wishlist found.product added to wishlist" });
                  console.log("Wishlist found.product added to wishlist");
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

router.get("/getWishList",auth, async function (req, res) {
 if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
  res.status(401).json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    const customer = await Buyer.findOne({ _id: req.user._id }).select('wishListId');
      /*var customer = {
      wishListId:"5fc006f71ebba134c80c9e89"
    };*/

    await WishList.findOne({ _id:customer.wishListId }, async function (err, wishListD) {
      if (err) {
        throw err;
      } else if (wishListD == null) {
        wishListD = [];
        res.status(200).send(wishListD);
      } else {
        //res.send(prod);
        if (wishListD.productIds.length == 0) {
          res.status(200).send("No product is added to wishlist");
        } else {
          var productArray = [];
          for (let i = 0; i < wishListD.productIds.length; i++) {
            productArray.push(wishListD.productIds[i]);
          }

          await Product.find({ _id: { $in: productArray } }, async function (err, product) {
            if (err) {
              throw err;
            } else if (product == null) {

              res.status(200).send("no product found.");
            } else {
              // console.log(product);
              res.status(200).send(product);
            }
          });
        }
      }
      //res.send(wishListD);
    });
  }
});

router.delete("/removeFromWishList/:id",auth, async function (req, res) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id) ) {
    return res.status(400).json({ success: false,type:false,message: 'Invalid product Id.' });
    
  }

  if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
    res.status(401).json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    const customer = await Buyer.findOne({ _id: req.user._id }).select('wishListId');
    /*var customer = {
      wishListId:"5fc006f71ebba134c80c9e89"
    };*/

    await WishList.findOne({ _id: customer.wishListId }, async function (err, wishL) {
      if (err) {
        throw err;
      }else{
      await WishList.updateOne({ _id: customer.wishListId }, { $pull: { productIds: { $in: req.params.id } } }, async function (err, product) {
        if (err) {
          res.status(500).json({ sucess: false, message: err });
        } else {
          res.status(200).json({ sucess: true, message: product + " product removed" });
        }
        //res.redirect("/products");
      })
    }
    })
  }
});

router.get("/countProductInWishlist",auth, async function (req, res) {

 if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
  res.status(401).json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    const customer = await Buyer.findOne({ _id: req.user._id }).select('wishListId');
    /*var customer = {
      wishListId:"5fc006f71ebba134c80c9e89"
    };*/

    await WishList.findOne({ _id: customer.wishListId }, async function (err, wishL) {
      if (err) {
        throw err;
      }else if(wishL == null){
        res.status(200).send(String(0));
      }else{
        if(wishL != null){
          var products=wishL.productIds;
          var countProducts = products.length;
          //console.log(countProducts);
          res.status(200).send(String(countProducts));
        }else{
          //console.log(0);
          res.status(200).send(String(0));
        }
       
    }
    })
  }
});



module.exports = router;
