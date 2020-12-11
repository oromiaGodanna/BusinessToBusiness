export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Category,SubCategory} = require('../models/category');
const mongoose = require('mongoose');
const { Customer, Buyer, Seller, Both,  DeleteRequest, validateCustomer, validateBuyer, validateSeller, validateBoth, validateDeleteRequest } = require('../models/customer');//const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

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


router.post("/addCategory", upload.single('image'),auth, async function (req, res) {
  var category = Category();
  category.name = req.body.categoryName;
  category.subCategories = req.body.subCategories;
  category.image = categoryImage[0];
  categoryImage=[];

 if ((req.user._id = "" || null) || (req.user.userType != 'Admin')) {
  res.status(401).json({
      sucess: false,
      message: "You must to login to add category and you must be admin"
    });

  } else {

  

    if (req.body.categoryName == null || req.body.categoryName == "" || req.body.image == null || 
    (req.body.subCategories != null && !(Array.isArray(req.body.subCategories)))) {
      res.status(400).json({
        sucess: false,
        message: "required fields are not filled or validation error"
      });
    } else {
      
      await category.save(async function (err,categoryCreated) {
        if (err) {
          res.status(500).json({ sucess: false, message: err });
        } else {

          res.status(200).json(categoryCreated);
        }
      });
    }
  }
});

router.post("/editCategory/:id",upload.single('image'),auth, async function (req, res) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid Id');
  }

  //const tok = req.token.userId;
  if ((req.user._id = "" || null) || (req.user.userType != 'Admin')) {
    res.status(401).json({
      sucess: false,
      message: "You must to login to update category and you must be admin"
    });

  } else {

    if (req.body.categoryName == null || req.body.categoryName == "" ) {
       res.status(400).json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      //console.log(tok);
     await Category.findOne({ _id: req.params.id }, async function (err, category) {
        if (err) {
          throw err;
  
        }else if(category == null){
          res.status(404).json({ sucess: true, message: "category not found" });
  
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
              res.status(500).json({ sucess: false, message: err });
            } else {
              res.status(200).json({ sucess: true, message: categoryD } );
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
    res.status(200).send(category);
  }).sort('-createDate');
});

router.get("/getCategory/:id", async function (req, res) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid Id.');
  }

  Category.findOne({ _id: req.params.id }, async function (err, category) {
    if (err) {
      throw err;
    } else if (category == null) {
      res.status(404).send("category not found");
    } else {
      res.status(200).send(category);
    }

  });
});

router.delete("/deleteCategory/:id",auth, async function (req, res) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid Id.');
  }

  //const tok = req.token.userId;
 if ((req.user._id = "" || null) || (req.user.userType != 'Admin')) {
    res.status(401).json({
      sucess: false,
      message: "You must to login to delete the category and you must be admin"
    });

  } else {
    await Category.findOne({ _id: req.params.id }, async function (err, category) {
      if (err) {
        throw err;

      }else if(category == null){
        res.status(404).json({ sucess: true, message: "category not found" });

      }else {
        if(fs.existsSync("../b2b/bTob/src/assets/images/categoryImages/"+category.image)){
          fs.unlinkSync("../b2b/bTob/src/assets/images/categoryImages/"+category.image);
        }
       await Category.deleteOne({ _id: req.params.id }, async function (err, ret) {
          if (err) {
            res.status(500).json({ sucess: false, message: err });
          } else {
            res.status(200).json({ sucess: true, message: "Category deleted" });
          }
        });
        //res.redirect("/products");  
      }
    })
  }

});

module.exports = router;
