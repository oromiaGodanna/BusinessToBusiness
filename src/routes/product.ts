const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Product, Filter, validateProduct } = require('../models/product');
//const User = require('../models/User');
//const Order = require('../models/order');
const multer = require('multer');
var imageNames = [];

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, '../b2b/bTob/src/assets/images/productImages')
  },
  filename: (req, file, callBack) => {
      var d = new Date();
      var nameImage =`${file.originalname}`;
      var imageName = d.getTime() + '_' + nameImage;
      callBack(null, imageName);
      imageNames.push(imageName);
      console.log(imageNames)
  }
})

const upload = multer({ storage: storage })
 


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

router.post('/file', upload.array('file'), (req, res, next) => {
  const file = req.file;
  console.log(file.filename);
  if (!file) {
    const error = new Error('No File')
   // error.httpStatusCode = 400
    return next(error)
  }
    res.send(file);
})

router.post("/createProduct", upload.array('images'), async function (req, res) {
  var product = Product();
  product.userId = req.token.userId;
  /*product.productName = req.body.productName;
  product.productCategory = req.body.productCategory;
  product.productSubCategory = req.body.productSubCategory;
  product.description = req.body.description;
  product.minOrder = req.body.minOrder;
  product.price = req.body.price;
  product.keyword = req.body.keyword;
  product.images = req.body.images;
  product.additionalProductInfo = req.body.additionalProductInfo;
  product.createDate = req.body.createDate;
  const image = req.body.image;
  console.log(image);*/

  product.productName = req.body.productName;
  product.productCategory = req.body.productCategory;
  product.productSubCategory = req.body.productSubCategory;
  product.description = req.body.description;
  product.minOrder = req.body.minOrder;
  product.price = req.body.price;
  product.keyword = req.body.keyword;
  product.measurement = req.body.measurement;
  product.images = imageNames;
  product.additionalProductInfo = req.body.additionalProductInfo;
  product.createDate = req.body.createDate;
  //const images = req.images;
  //console.log(this.images);
  imageNames=[];
  if ((req.token.userId = "" || null) || (req.token.userType.localeCompare("seller"))) {
    res.json({
      sucess: false,
      message: "You must to login to add product and you must be seller"
    });

  } else {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);

    } else {

      await product.save(async function (err, productCreated) {
        if (err) {
          res.json({ sucess: false, message: err });
        } else {
          res.json({ sucess: true, message: "product added" + productCreated });
        }
      });

    }
  }
});

router.post("/updateProduct/:id", async function (req, res) {

  const tok = req.token.userId;
  if ((req.token.userId = "" || (req.token.userId = null)) || (req.token.userType.localeCompare("seller"))) {
    res.json({
      sucess: false,
      message: "You must to login to update product and you must be seller"
    });

  } else {

    const { error } = validateProduct(req.body);
   console.log(req.body.productName);
   console.log(req.productName);
    console.log(req.body.minOrder);
    if (error) {
      return res.status(400).send(error.details[0].message);

    } else {
      //console.log(tok);
      await Product.findOne({ _id: req.params.id }, async function (err, product) {
        if (err) {
          throw err;

        } else if (product == null) {
          res.json({ sucess: true, message: "product not found" });

        } else if (product.userId != tok) {
          //console.log(tok);
          res.send("you cannot update the product");

        } else {

          await Product.updateOne({ _id: req.params.id }, {
            $set: {

              productName: req.body.productName,
              productCategory: req.body.productCategory,
              productSubCategory: req.body.productSubCategory,
              description: req.body.description,
              measurement: req.body.measurement,
              minOrder: req.body.minOrder,
              price: req.body.price,
              keyword: req.body.keyword,
              images: req.body.images,
              additionalProductInfo: req.body.additionalProductInfo

            }
          }, async function (err, productD) {
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
//////
router.get("/getProducts/:offset/:limit", async function (req, res) {
  var offset = Number(req.params.offset);
   var limit = Number(req.params.limit);
  await Product.find({ specialOfferId: null,deleted:false}, async function (err, products) {
    if (err) throw err;
    res.send(products);
  }).sort('createDate').skip(offset).limit(limit);
});

router.get("/getAllProducts", async function (req, res) {
  
  await Product.find({ specialOfferId: null,deleted:false}, async function (err, products) {
    if (err) throw err;
    res.send(products);
  }).sort('createDate');
});


router.get("/getProduct/:id", async function (req, res) {
  Product.findOne({ _id: req.params.id,deleted:false }, async function (err, product) {
    if (err) {
      throw err;
    } else if (product == null) {
      res.send("product not found");
    } else {
      res.send(product);
    }

  });
});

router.post("/getProducts", async function (req, res) {
  var productIds = req.body.productIds;
  await Product.find({ _id: { $in: productIds },deleted:false}, async function (err, product) {
    if (err) {
      throw err;
    } else if (product == null) {
      res.send("product not found");
    } else {
      res.send(product);
    }

  });
});


router.get("/getProductSeller/:userId", async function (req, res) {

  if (req.token.userId.localeCompare(req.params.userId) || (req.token.userType.localeCompare("seller"))) {
    res.json({
      sucess: false,
      message: "You must to login to get your products and you must be seller"
    });

  } else {
    await Product.find({ userId: req.params.userId,deleted:false }, async function (err, product) {
      if (err) {
        throw err;
      } else if (product == null) {
        res.send("you have not posted products yet");
      }
      res.send(product);
    });
  }
});

router.get("/getAllRelatedProductByCategory/:productCategory", async function (req, res) {
  
    await Product.find({ productCategory: req.params.productCategory,deleted:false,specialOfferId:null}, async function (err, product) {
      if (err) {
        throw err;
      } else{
        res.send(product);
      }
    });
 
});

router.get("/getRelatedProductByCategory/:productCategory/:offset/:limit", async function (req, res) {
  var offset = Number(req.params.offset);
  var limit = Number(req.params.limit);
  await Product.find({ productCategory: req.params.productCategory,deleted:false,specialOfferId:null}, async function (err, product) {
    if (err) {
      throw err;
    } else{
      res.send(product);
    }
  }).sort('createDate').skip(offset).limit(limit);

});

router.get("/getAllRelatedProductBySubCategory/:productSubCategory", async function (req, res) {
  
  await Product.find({ productSubCategory: req.params.productSubCategory,deleted:false,specialOfferId:null}, async function (err, product) {
    if (err) {
      throw err;
    } else{
      res.send(product);
    }
  });

});

router.get("/getRelatedProductBySubCategory/:productSubCategory/:offset/:limit", async function (req, res) {
  var offset = Number(req.params.offset);
  var limit = Number(req.params.limit);
  await Product.find({ productSubCategory: req.params.productSubCategory,deleted:false,specialOfferId:null}, async function (err, product) {
    if (err) {
      throw err;
    } else{
      res.send(product);
    }
  }).sort('createDate').skip(offset).limit(limit);

});


router.delete("/deleteProduct/:id", async function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId == "" || null) || (req.token.userType.localeCompare("seller"))) {
    res.json({
      success: false,
      message: "You must to login to delete the product and you must be the product's seller"
    });

  } else {
    await Product.findOne({ _id: req.params.id }, async function (err, product) {
      if (err) {
        throw err;

      } else if (product == null) {
        res.json({ success: true, message: "product not found" });

      } else if (product.userId != tok) {
        console.log(req.token.userId);
        res.send("you cannot delete the product");

      } else {
        await Product.updateOne({ _id: req.params.id }, {
          $set: {
            deleted: true,
          }
        }, async function (err, productD) {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            res.json({ success: true, message: "product deleted" });
          }
        })
       /* await Product.deleteOne({ _id: req.params.id }, async function (err, ret) {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            res.json({ success: true, message: "product deleted" });
          }
        });*/

        //res.redirect("/products");  
      }
    })
  }

});


//filter product based on given criteria
router.post("/filter/:offset/:limit", async function (req, res) {
   var offset = Number(req.params.offset);
   var limit = Number(req.params.limit);
   var productCategory = req.body.productCategory;
   //console.log(productCategory);
   var productSubCategory = req.body.productSubCategory;
   //console.log(productSubCategory);
   var maxPrice = parseFloat(req.body.maxPrice);
    //console.log(maxPrice);
    
    await Product.find({
      $and:[{ productCategory:productCategory},
      {productSubCategory:productSubCategory},
      {price: { $lt: maxPrice }},
      {deleted:false}]}, async function (err, products) {
      if (err) throw err;
        res.send(products);
    }).sort('createDate').skip(offset).limit(limit);

  

});

router.get("/search/:searchWord/:offset/:limit", async function (req, res) {
  var offset = Number(req.params.offset);
  var limit = Number(req.params.limit);
  await Product.find(
    {
      $or: [{ productName: req.params.searchWord },
      { keyword: { $in: req.params.searchWord } },
      { description: req.params.searchWord },
      { productCategory: req.params.searchWord },
      { productSubCategory: req.params.searchWord }]
    }, async function (err, products) {
      //Product.find({productName:/.*req.body.filter.*/}, function(err, products) {

      if (err) throw err;
      res.send(products);
    }).sort('createDate').skip(offset).limit(limit);
});

module.exports = router;
