import { isNumber } from "util";

export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Product} = require('../models/product');
const mongoose = require('mongoose');
const {Cart} = require('../models/cart');
const { Customer, Buyer, Seller, Both,  DeleteRequest, validateCustomer, validateBuyer, validateSeller, validateBoth, validateDeleteRequest } = require('../models/customer');//const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

router.use(bodyParser.json());


router.post("/addToCart",auth, async function (req, res) {
    var cart = Cart();
    
    if (!mongoose.Types.ObjectId.isValid(req.body.productId) ) {
        return res.status(400).json({ success: false,type:false,message: 'Invalid product Id.' });
    
    }
    if((req.body.amount == null) || (!(isNumber(req.body.amount))) || (req.body.productId == null)){
        return res.status(400).json({ success: false,type:false,message: 'validation error' });
    }


    if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
        res.status(401).json({
            success: false,
            type:false,
            message: "you must log in"
        });
    } else {
        const customer = await Buyer.findOne({ _id: req.user._id }).select('cartId');
        /* var customer={
            cartId:"5fc006f71ebba134c80c9e89"
         };*/
         
        await Product.findOne({ _id: req.body.productId },async function (err, productExist) {
            if (err) {
                throw err;
            }
            else if (productExist == null) {
                res.status(404).json({
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
                                res.status(500).json({ success: false,type:false, message: err });
                            } else {
                                
                                Buyer.updateOne({ _id:req.user._id }, {

                                      $set: {
                                          cartId : createdCart._id
                                      }
                                    }, function (err, productD) {
                                      if (err) {
                                        res.status(500).json({ success: false,type:false,message: err });
                                      }
                                      else{
                                        res.status(200).json({ success: true,type:true, message: "product added to cart!!"+createdCart});
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

                            res.status(200).json({ success: true,type:false, message: "product already added to cart" });
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
                                    res.status(500).json({ success: false,type:false, message: err });
                                } else {
                                    res.status(200).json({ success: true,type:true, message: "cart found.product added to cart" });
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
        res.status(401).json({
            sucess: false,
            message: "you must log in"
        });
    } else {
        const customer = await Buyer.findOne({ _id: req.user._id }).select('cartId');
        /* var customer={
            cartId:"5fc006f71ebba134c80c9e89"
         };*/
        await Cart.findOne({ _id: customer.cartId }, async function (err, cart) {
            if (err) {
                throw err;
            } else if (cart == null) {
                res.status(200).send(cart);
            } else {
                if (cart.cartEntries.length == 0) {
                    res.status(200).send(cart);
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
                       res.status(200).send(products);
                        //res.send(product);
                    });
                }
            }
        });
    }
});

router.delete("/removeFromCart/:id",auth, async function (req, res) {

    if (!mongoose.Types.ObjectId.isValid(req.params.id) ) {
        return res.status(400).json({ success: false,type:false,message: 'Invalid product Id.' });
    
    }

    if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
        res.status(401).json({
            sucess: false,
            message: "you must log in"
        });
    } else {

        const customer = await Buyer.findOne({ _id: req.user._id }).select('cartId');
        /* var customer={
            cartId:"5fc006f71ebba134c80c9e89"
         };*/

        await Cart.findOne({ _id: customer.cartId }, async function (err, cartD) {
            if (err) {
                throw err;
            }else {
               await Cart.updateOne(
                   { _id: customer.cartId }, 
                   { $pull: { 
                       cartEntries: { 
                           productId: { $in: req.params.id } } } },async function (err, productIncart) {
                    if (err) {
                        res.status(500).json({ sucess: false, message: err });
                    } else if (productIncart.nModified == 0) {
                        res.status(200).send({ sucess: false, message:"no product found to delete"});
                    } else {
                        res.status(200).json({ sucess: true, message: productIncart });
                    }
                    //res.redirect("/products");
                })
            }
        })
    }
});

router.get("/countProductInCart",auth, async function (req, res) {

   if (req.user._id == "" || req.user._id == null || req.user.userType == 'Admin' || req.user.userType == 'Seller' ) {
    res.status(401).json({
        sucess: false,
        message: "you must log in"
      });
    } else {
         const customer = await Buyer.findOne({ _id: req.user._id }).select('cartId');
        /* var customer={
            cartId:"5fc006f71ebba134c80c9e89"
         };*/

      await Cart.findOne({ _id: customer.cartId }, async function (err, cart) {
        if (err) {
          throw err;
        }else if(cart == null){
            res.status(200).send(String(0));
        }else{
          if(cart != null){
            var products=cart.cartEntries;
            var countProducts = products.length;
            //console.log(countProducts);
            res.status(200).send(String(countProducts));
          }else{
           // console.log(0);
           res.status(200).send(String(0));
          }
         
      }
      })
    }
  });

module.exports = router;