export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var {Product} = require('../models/product');
var {Cart} = require('../models/cart');
const { Customer, Buyer, Seller, Both,  DeleteRequest, validateCustomer, validateBuyer, validateSeller, validateBoth, validateDeleteRequest } = require('../models/customer');//const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

router.use(bodyParser.json());


router.post("/addToCart",auth, async function (req, res) {
    var cart = Cart();
    //cart.cartId = req.token.cartId;

    if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
        res.json({
            success: false,
            type:false,
            message: "you must log in"
        });
    } else {
         const customer = await Buyer.findOne({ _id: req.user._id }).select('cartId');
         console.log(customer);

        await Product.findOne({ _id: req.body.productId },async function (err, productExist) {
            if (err) {
                throw err;
            }
            else if (productExist == null) {
                res.json({
                    success: false,
                    type:false,
                    message: "Sorry,The product you wish to add to cart doesnot exist"
                });
            } else {
               
                cart.cartEntries.productId = req.body.productId;
                cart.cartEntries.amount = req.body.amount;
                cart.cartEntries.additionalInfo = req.body.additionalInfo;

                await Cart.findOne({ _id: customer.cartId },async function (err, cartExistence) {
                    if (err) {
                        throw err;
                    }
                    //res.send(wishList);
                    else if (cartExistence == null) {
                        
                        console.log(cartExistence);
                       await cart.save(function (err, createdCart) {
                            if (err) {
                                res.json({ success: false,type:false, message: err });
                            } else {
                                
                                Buyer.updateOne({ _id:req.user._id }, {

                                      $set: {
                                          cartId : createdCart._id
                                      }
                                    }, function (err, productD) {
                                      if (err) {
                                         res.json({ success: false,type:false,message: err });
                                      }
                                      else{
                                         res.json({ success: true,type:true, message: "product added to cart!!"+createdCart});
                                      } 
                                    });
                                
                            }
                        });
                    } else {

                        var cartArray = [];
                        for (let i = 0; i < cartExistence.cartEntries.length; i++) {
                            cartArray.push(cartExistence.cartEntries[i].productId);
                        }

                        if (cartArray.includes(req.body.productId)) {

                            res.json({ success: true,type:false, message: "product already added to cart" });
                        } else {

                           await Cart.updateOne(
                                { _id: customer.cartId }, 
                                { $addToSet: { 
                                    cartEntries: { 
                                        productId: req.body.productId, 
                                        additionalInfo: req.body.additionalInfo, 
                                        amount: req.body.amount 
                                    } } },async function (err, c) {
                                if (err) {
                                    res.json({ success: false,type:false, message: err });
                                } else {
                                    res.json({ success: true,type:true, message: "cart found.product added to cart" });
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

/*router.get("/getCarts",auth, async function (req, res) {
   if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {
    await Cart.find({}, async function (err, cart) {
      res.send(cart);
    });
  }
});*/

router.get("/getCart",auth, async function (req, res) {

    if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
        res.json({
            sucess: false,
            message: "you must log in"
        });
    } else {
        const customer = await Buyer.findOne({ _id: req.user._id }).select('cartId');

        await Cart.findOne({ _id: customer.cartId }, async function (err, cart) {
            if (err) {
                throw err;
            } else if (cart == null) {
                res.send(cart);
            } else {
                if (cart.cartEntries.length == 0) {
                    res.send(cart);
                } else {
                    var productArray = [];
                    for (let i = 0; i < cart.cartEntries.length; i++) {
                        productArray.push(cart.cartEntries[i].productId);
                    }
                    await Product.find({ _id: { $in: productArray } }, async function (err, product) {
                        if (err) throw err;
                        // console.log(product);
                        var products=[];
                        //var singleProduct:any = {};
                        for (let i = 0; i < product.length; i++) {
                            var singleProduct = {
                                _id:product[i]._id,
                                specialOfferId:product[i].specialOfferId,
                                productSubCategory:product[i].productSubCategory,
                                productCategory:product[i].productCategory,
                                description:product[i].description,
                                measurement:product[i].measurement,
                                keyword:product[i].keyword,
                                images:product[i].images,
                                additionalProductInfo:product[i].additionalProductInfo,
                                deleted:product[i].deleted,
                                createDate:product[i].createDate,
                                userId:product[i].userId,
                                productName:product[i].productName,
                                minOrder:product[i].minOrder,
                                price:product[i].price,
                                cartEntries:{
                                    _id:cart.cartEntries[i]._id,
                                    productId:cart.cartEntries[i].productId,
                                    amount:cart.cartEntries[i].amount,
                                    additionalInfo:cart.cartEntries[i].additionalInfo
                                }
                            };
                            products.push(singleProduct);
                        }
                       //console.log(products[0].cartEntries.additionalInfo[0]);
                        res.send(products);
                        //res.send(product);
                    });
                }
            }
        });
    }
});

router.delete("/removeFromCart/:id",auth, async function (req, res) {

    if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
        res.json({
            sucess: false,
            message: "you must log in"
        });
    } else {

         const customer = await Buyer.findOne({ _id: req.user._id }).select('cartId');

        await Cart.findOne({ _id: customer.cartId }, async function (err, cartD) {
            if (err) {
                throw err;
            } else if (cartD == null) {
                res.send("you cannot delete product from cart");
            } else {
               await Cart.updateOne(
                   { _id: customer.cartId }, 
                   { $pull: { 
                       cartEntries: { 
                           productId: { $in: req.params.id } } } },async function (err, productIncart) {
                    if (err) {
                        res.json({ sucess: false, message: err });
                    } else if (productIncart.nModified == 0) {
                        res.send({ sucess: false, message:"no product found to delete"});
                    } else {
                        res.json({ sucess: true, message: productIncart });
                    }
                    //res.redirect("/products");
                })
            }
        })
    }
});

router.get("/countProductInCart",auth, async function (req, res) {

   if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
      res.json({
        sucess: false,
        message: "you must log in"
      });
    } else {
         const customer = await Buyer.findOne({ _id: req.user._id }).select('cartId');

      await Cart.findOne({ _id: customer.cartId }, async function (err, cart) {
        if (err) {
          throw err;
        }else if(cart == null){
            res.send(String(0));
        }else{
          if(cart != null){
            var products=cart.cartEntries;
            var countProducts = products.length;
            //console.log(countProducts);
            res.send(String(countProducts));
          }else{
           // console.log(0);
            res.send(String(0));
          }
         
      }
      })
    }
  });

module.exports = router;