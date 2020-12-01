import { count } from "console";

export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var {Product} = require('../models/product');
var {WishList,validateWishListProduct} = require('../models/wishList');
const { Customer, Buyer, Seller, Both,  DeleteRequest, validateCustomer, validateBuyer, validateSeller, validateBoth, validateDeleteRequest } = require('../models/customer');//const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

router.use(bodyParser.json());


router.get("/check",auth, async function (req, res) {
    
    var customer = await Customer.findOne({ _id: req.user._id }).select('wishListId');
    res.send(req.user);
});


router.post("/addToWishList",auth, async function (req, res) {
     

  var wishList = WishList();
  // wishList.wishListId = req.token.wishListId;
  wishList.productIds = req.body.productIds;

  if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
    res.json({
      success: false,
      message: "you must log in and you must be either customer or both"
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


       const customer = await Buyer.findOne({ _id: req.user._id }).select('wishListId');
       //console.log("customer wishListId " + customer.wishListId );

       await WishList.findOne({ _id: customer.wishListId }, async function (err, wishL) {
           console.log(wishL);
          if (err) {
            throw err;
          }
          //res.send(wishList);
          else if (wishL == null) {
           
           await wishList.save(function (err, createdWishList) {
              if (err) {
                res.json({ success: false,type:false,message: err });
              } else {

              //Buyer.updateOne({_id:req.user._id},{$set:{wishListId:createdWishList._id}});
               //console.log(createdWishList._id);
                Buyer.updateOne({ _id:req.user._id }, {

                  $set: {
                      wishListId : createdWishList._id
                  }
                }, function (err, productD) {
                  if (err) {
                     res.json({ success: false,type:false,message: err });
                  }
                  else{
                     res.json({ success: true,type:true,message: 'product added to wishlist' });
                  } 
                });

              }
            });
          } else {

            if (wishL.productIds.includes(req.body.productIds)) {

              res.json({ success: true,type:false, message: "product already added to wishlist" });
            } else {

             await WishList.updateOne(
               { _id: customer.wishListId }, 
               { $addToSet: { productIds: req.body.productIds } 
              }, async function (err, w) {
                if (err) {
                  res.json({ success: false,type:false, message: err });
                } else {
                  res.json({ success: true,type:true, message: "Wishlist found.product added to wishlist" });
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

router.get("/getWishList",auth, async function (req, res) {
 if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    const customer = await Buyer.findOne({ _id: req.user._id }).select('wishListId');

    await WishList.findOne({ _id:customer.wishListId }, async function (err, wishListD) {
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

router.delete("/removeFromWishList/:id",auth, async function (req, res) {

  if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    const customer = await Buyer.findOne({ _id: req.user._id }).select('wishListId');
    await WishList.findOne({ _id: customer.wishListId }, async function (err, wishL) {
      if (err) {
        throw err;
      }else{
      await WishList.updateOne({ _id: customer.wishListId }, { $pull: { productIds: { $in: req.params.id } } }, async function (err, product) {
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

router.get("/countProductInWishlist",auth, async function (req, res) {

 if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    const customer = await Buyer.findOne({ _id: req.user._id }).select('wishListId');

    await WishList.findOne({ _id: customer.wishListId }, async function (err, wishL) {
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
