export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var {Category,SubCategory} = require('../models/category');
//const User = require('../models/User');
//const Order = require('../models/order');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
var categoryImage = [];

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, '../b2b/bTob/src/assets/images/categoryImages')
  },
  filename: (req, file, callBack) => {
      var d = new Date();
      var nameImage =`${file.originalname}`;
      var imageName = d.getTime() + '_' + nameImage;
      callBack(null, imageName);
      categoryImage.push(imageName); 
      console.log(categoryImage)
  }
})

const upload = multer({ storage: storage })

router.use(bodyParser.json());

router.use(function (req, res, next) {
  var token = {
    userId: "user1211143",
    userType: "admin"
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

router.post("/addCategory", upload.single('image'), async function (req, res) {
  var category = Category();
  category.name = req.body.categoryName;
  category.subCategories = req.body.subCategories;
  category.image = categoryImage[0];
  categoryImage=[];

  if ((req.token.userId = "" || null) || (req.token.userType.localeCompare("admin"))) {
    res.json({
      sucess: false,
      message: "You must to login to add category and you must be admin"
    });

  } else {

    if (req.body.categoryName == null || req.body.categoryName == "") {
      res.json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      
      await category.save(async function (err,categoryCreated) {
        if (err) {
          res.json({ sucess: false, message: err });
        } else {

          res.json(categoryCreated);
        }
      });
    }
  }
});

router.post("/editCategory/:id",upload.single('image'), async function (req, res) {

  const tok = req.token.userId;
  if ((req.token.userId = "" || (req.token.userId = null)) || (req.token.userType.localeCompare("admin"))) {
    res.json({
      sucess: false,
      message: "You must to login to update category and you must be admin"
    });

  } else {

    if (req.body.categoryName == null || req.body.categoryName == "" ) {
      res.json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      //console.log(tok);
     await Category.findOne({ _id: req.params.id }, async function (err, category) {
        if (err) {
          throw err;
  
        }else if(category == null){
          res.json({ sucess: true, message: "category not found" });
  
        }else {

          var categoryImageSelected;
         
          if(categoryImage[0] == null || categoryImage[0] == ""){
            categoryImageSelected = category.image;
          }else{
            categoryImageSelected = categoryImage[0];
            fs.unlinkSync("../b2b/bTob/src/assets/images/categoryImages/"+category.image);
          }

          categoryImage=[];

         await Category.updateOne({ _id: req.params.id }, {
            $set: {

              name: req.body.categoryName,
              subCategories: req.body.subCategories,
              image:categoryImageSelected
              
            }
          }, async function (err, categoryD) {
            if (err) {
              res.json({ sucess: false, message: err });
            } else {
              res.json({ sucess: true, message: categoryD } );
            }
            //res.redirect("/products");
          });
        }
      })
    }
  }
});

router.get("/getCategories", async function (req, res) {
  await Category.find({}, async function (err, category) {
    if (err) throw err;
    res.send(category);
  }).sort('createDate');
});

router.get("/getCategory/:id", async function (req, res) {
  Category.findOne({ _id: req.params.id }, async function (err, category) {
    if (err) {
      throw err;
    } else if (category == null) {
      res.send("category not found");
    } else {
      res.send(category);
    }

  });
});

router.delete("/deleteCategory/:id", async function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId=="" || null) || (req.token.userType.localeCompare("admin"))) {
    res.json({
      sucess: false,
      message: "You must to login to delete the category and you must be admin"
    });

  } else {
    await Category.findOne({ _id: req.params.id }, async function (err, category) {
      if (err) {
        throw err;

      }else if(category == null){
        res.json({ sucess: true, message: "category not found" });

      }else {
        fs.unlinkSync("../b2b/bTob/src/assets/images/categoryImages/"+category.image);
       await Category.deleteOne({ _id: req.params.id }, async function (err, ret) {
          if (err) {
            res.json({ sucess: false, message: err });
          } else {
            res.json({ sucess: true, message: "Category deleted" });
          }
        });
        //res.redirect("/products");  
      }
    })
  }

});

module.exports = router;
