import { ObjectId } from "bson";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Product = require('../models/product');
//const User = require('../models/User');
//const Order = require('../models/order');
const mongoose = require('mongoose');

router.use(bodyParser.json());

router.use(function (req, res, next) {
  var token = {
    userId: "user1211143",
    userType: "seller"
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

router.post("/createProduct", function (req, res) {
  var product = Product();
  product.userId = req.token.userId;
  product.productName = req.body.productName;
  product.productCategory = req.body.productCategory;
  product.productSubCategory = req.body.productSubCategory;
  product.description = req.body.description;
  product.minOrder = req.body.minOrder;
  product.price = req.body.price;
  product.keyword = req.body.keyword;
  product.images = req.body.images;
  product.additionalProductInfo = req.body.additionalProductInfo;
  product.createDate = req.body.createDate;

  if ((req.token.userId = "" || null) || (req.token.userType.localeCompare("seller"))) {
    res.json({
      sucess: false,
      message: "You must to login to add product and you must be seller"
    });

  } else {

    if (req.body.productName == null || req.body.productCategory == null || req.body.price == null || req.body.productName == "" || req.body.productCategory == "" || req.body.productCategory == "") {
      res.json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      product.save(function (err) {
        if (err) {
          res.json({ sucess: false, message: err });
        } else {
          res.json({ sucess: true, message: "product added" });
        }
      });
    }
  }
});

router.post("/updateProduct/:id", function (req, res) {

  const tok = req.token.userId;
  if ((req.token.userId = "" || (req.token.userId = null)) || (req.token.userType.localeCompare("seller"))) {
    res.json({
      sucess: false,
      message: "You must to login to update product and you must be seller"
    });

  } else {

    if (req.body.productName == null || req.body.productCategory == null || req.body.productCategory == null || req.body.productName == "" || req.body.productCategory == "" || req.body.productCategory == "") {
      res.json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      //console.log(tok);
      Product.findOne({ _id: req.params.id }, function (err, product) {
        if (err) {
          throw err;
  
        }else if(product == null){
          res.json({ sucess: true, message: "product not found" });
  
        } else if (product.userId != tok) {
          //console.log(tok);
          res.send("you cannot update the product");
  
        } else {

          Product.updateOne({ _id: req.params.id }, {
            $set: {

              productName: req.body.productName,
              productCategory: req.body.productCategory,
              productSubCategory: req.body.productSubCategory,
              description: req.body.description,
              minorder: req.body.minOrder,
              price: req.body.price,
              keyword: req.body.keyword,
              images: req.body.images,
              additionalProductInfo: req.body.additionalProductInfo

            }
          }, function (err, productD) {
            if (err) {
              res.json({ sucess: false, message: err });
            } else {
              res.json({ sucess: true, message: productD });
            }
            //res.redirect("/products");
          });
        }
      })
    }
  }
});

router.get("/getProducts", function (req, res) {
  Product.find({}, function (err, products) {
    if (err) throw err;
    res.send(products);
  }).sort({ createDate: -1 });
});

router.get("/getProduct/:id", function (req, res) {
  Product.findOne({ _id: req.params.id }, function (err, product) {
    if (err) {
      throw err;
    } else if (product == null) {
      res.send("product not found");
    } else {
      res.send(product);
    }

  });
});

router.get("/getProductSeller/:userId", function (req, res) {

  if (req.token.userId.localeCompare(req.params.userId) || (req.token.userType.localeCompare("seller"))) {
    res.json({
      sucess: false,
      message: "You must to login to get your products and you must be seller"
    });

  } else {
    Product.find({ userId: req.params.userId }, function (err, product) {
      if (err) {
        throw err;
      } else if (product == null) {
        res.send("you have not posted products yet");
      }
      res.send(product);
    });
  }
});

router.get("/deleteProduct/:id", function (req, res) {

  if ((req.token.userId=="" || null) || (req.token.userType.localeCompare("seller"))) {
    res.json({
      sucess: false,
      message: "You must to login to delete the product and you must be the product's seller"
    });

  } else {
    Product.findOne({ _id: req.params.id }, function (err, product) {
      if (err) {
        throw err;

      }else if(product == null){
        res.json({ sucess: true, message: "product not found" });

      } else if (product.userId != req.token.userId) {
        console.log(req.token.userId);
        res.send("you cannot delete the product");

      } else {
        Product.deleteOne({ _id: req.params.id }, function (err, ret) {
          if (err) {
            res.json({ sucess: false, message: err });
          } else {
            res.json({ sucess: true, message: "product deleted" });
          }
        });
        //res.redirect("/products");  
      }
    })
  }

});


//filter product based on given criteria
router.post("/search", function (req, res) {
  if (req.body.productCategory = "all" && (req.body.productSubCategory = "all") && (req.body.maxProductPrice = null)) {
    Product.find({}, function (err, products) {
      if (err) throw err;
      res.send(products);
    }).sort({ createDate: -1 });
  } else {
    
  Product.find({ }, function (err, products) {
    //Product.find({productName:/.*req.body.filter.*/}, function(err, products) {
    if (err) throw err;
    res.send(products);
  }).sort({ createDate: -1 });

    /*Product.find({ $and: [{ productCategory: req.body.productCategory }, { productSubCategory: req.body.productSubCategory }, { price: { $lte: req.body.maxProductPrice } }] }, function (err, products) {
      if (err) throw err;
      res.send(products);
    }).sort({ createDate: -1 });*/
  }
});

router.post("/searchData", function (req, res) {

  Product.find({ $or: [{ productName: req.body.filter }, { keyword: { $in: req.body.filter } }, { description: req.body.filter }, { productCategory: req.body.filter }, { productSubCategory: req.body.filter }] }, function (err, products) {
    //Product.find({productName:/.*req.body.filter.*/}, function(err, products) {

    if (err) throw err;
    res.send(products);
  });
});

module.exports = router;
