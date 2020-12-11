export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var { Product } = require('../models/product');
var { SpecialOffer, validateSpecialOffer } = require('../models/specialOffer');
const mongoose = require('mongoose');
const { Customer, Buyer, Seller, Both,  DeleteRequest, validateCustomer, validateBuyer, validateSeller, validateBoth, validateDeleteRequest } = require('../models/customer');//const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

var foundProducts = [];

router.use(bodyParser.json());


router.post("/createSpecialOffer",auth, async function (req, res) {
    var tokId = req.user._id;
    var specialOffer = SpecialOffer();
    specialOffer.userId = req.user._id;
    specialOffer.productId = req.body.productId;
    specialOffer.title = req.body.title;
    specialOffer.discount = req.body.discount;
    specialOffer.startDate = req.body.startDate;
    specialOffer.endDate = req.body.endDate;

   

    const { error } = validateSpecialOffer(req.body);

    if ((req.user._id = "" || null) || (req.user.userType != 'Admin' && req.user.userType != 'Seller' && req.user.userType != 'Both')) {
        res.status(401).json({
            sucess: false,
            message: "You must login to add special offer to product"
        });

    } else if (error) {
        return res.status(400).send(error.details[0].message);

    } else {

        if (!mongoose.Types.ObjectId.isValid(req.body.productId)) {
            return res.status(400).send('Invalid Id.');
        }
        
        await Product.findOne({ _id: req.body.productId }, async function (err, productInfo) {

            if (err) {
                throw err;
            }
            //|| (productInfo.userId.localeCompare(req.token.userId) )
            else if ((productInfo == null || (productInfo.userId.localeCompare(tokId) != 0))) {
                res.status(404).json({
                    sucess: false,
                    message: "Product not found"
                });
            } else {
                //specialOffer.specialOfferId = "1";
                //specialOffer.specialOfferId = productInfo.specialOfferId;
                await SpecialOffer.findOne({ productId: req.body.productId }, async function (err, specialOfferD) {
                    if (err) {
                        throw err;
                    }
                    else if (specialOfferD != null) {
                        res.status(200).json({
                            sucess: false,
                            message: "The product is already on special offer"
                        });
                    }
                    else {
                        await specialOffer.save(async function (err, specialOffer) {
                            if (err) {
                                res.status(500).json({ sucess: false, message: err });
                            } else {
                                
                                res.status(200).json({ sucess: true, message: specialOffer + "/n" + "special offer is added to the product" });
                            }
                        });
                    }
                })

            }

        });
    }
});

router.post("/openSpecialOffer/:specialOfferId",auth, async function (req, res) {

    if (!mongoose.Types.ObjectId.isValid(req.params.specialOfferId)) {
        return res.status(400).send('Invalid Id.');
    }

    var tokId = req.user._id;
    if ((req.user._id = "" || null) || (req.user.userType != 'Admin' && req.user.userType != 'Seller' && req.user.userType != 'Both')) {
        res.status(401).json({
            sucess: false,
            message: "You must login to open special offer"
        });

    } else {

        await Product.findOne({ _id: req.body.productId }, async function (err, productInfo) {
            if (err) {
                throw err;
            }
            else if (productInfo == null || (productInfo.userId.localeCompare(tokId) != 0)) {

                res.status(404).json("you cannot open the special offer");

            } else {

                await SpecialOffer.findOne({ _id: req.params.specialOfferId }, async function (err, specialOfferD) {
                    if (err) {
                        throw err;
                    } else if (specialOfferD == null) {

                        res.status(404).json("you cannot open the special offer since the offer isnot created yet");
                    } else {

                       
                        await SpecialOffer.updateOne({ _id: req.params.specialOfferId }, {
                            $set: {

                                status: true,

                            }
                        }, async function (err, specialOffer) {
                            if (err) {
                                res.status(500).json({ sucess: false, message: err });
                            } else {
                             
                                await Product.updateOne(
                                    { _id: req.body.productId },
                                    { $set: { specialOfferId: req.params.specialOfferId } }, async function (err, proD) {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                    res.status(200).json({ sucess: true, message: "special offer is open now" });
                             
                            }
                            //res.redirect("/products");
                        });
                    }
                })


            }
        })
    }
});

router.post("/closeSpecialOffer/:specialOfferId",auth, async function (req, res) {

    if (!mongoose.Types.ObjectId.isValid(req.params.specialOfferId)) {
        return res.status(400).send('Invalid Id.');
    }

     var tokId = req.user._id;
    if ((req.user._id = "" || null) || (req.user.userType != 'Admin' && req.user.userType != 'Seller' && req.user.userType != 'Both')) {
        res.status(401).json({
            sucess: false,
            message: "You must login to close special offer"
        });

    } else {

        await Product.findOne({ specialOfferId: req.params.specialOfferId }, async function (err, productInfo) {
            if (err) {
                throw err;
            }
            else if (productInfo == null || (productInfo.userId.localeCompare(tokId) != 0)) {

                res.status(404).json("you cannot close the special offer");

            } else {

                await SpecialOffer.findOne({ _id: req.params.specialOfferId }, async function (err, specialOfferD) {
                    if (err) {
                        throw err;
                    } else if (specialOfferD == null) {

                        res.status(404).json("you cannot close the special offer since the offer isnot created yet");
                    } else {

                        await SpecialOffer.updateOne({ _id: req.params.specialOfferId }, {
                            $set: {

                                status: false,


                            }
                        }, async function (err, specialOffer) {
                            if (err) {
                                res.status(500).json({ sucess: false, message: err });
                            } else {
                                if (req.body.endDate != null) {
                                    res.status(500).json(specialOffer.endDate);
                                }
                                res.status(200).json({ sucess: true, message: "special offer is closed now" });
                            }
                            //res.redirect("/products");
                        });
                    }
                })


            }
        })
    }
});

router.delete("/deleteOffer/:productId",auth, async function (req, res) {

    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
        return res.status(400).send('Invalid Id.');
    }


    var tokId = req.user._id;
    if ((req.user._id = "" || null) || (req.user.userType != 'Admin' && req.user.userType != 'Seller' && req.user.userType != 'Both')) {
        res.status(401).json({
            sucess: false,
            message: "You must login to delete the special offer"
        });

    } else {
        await Product.findOne({ _id: req.params.productId }, async function (err, productInfo) {
            if (err) {
                throw err;
            }
            else if (productInfo == null || (productInfo.userId.localeCompare(tokId) != 0)) {

                res.status(404).json("you cannot delete the special offer");

            } else {

                await SpecialOffer.find({ productId: req.params.productId }, async function (err, specialOfferD) {
                    if (specialOfferD == null) {

                        res.status(404).json("you cannot delete the special offer since the offer has not been created yet");
                    } else {
                        await SpecialOffer.deleteOne({ productId: req.params.productId }, async function (err, ret) {
                            if (err) {
                                res.status(500).json({ sucess: false, message: err });
                            } else {
                                //res.json({ sucess: true, message: "special offer deleted" });
                                await Product.updateOne(
                                    { _id: req.params.productId },
                                    { $set: { specialOfferId: null } }, async function (err, proD) {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                    res.status(200).json({ sucess: true, message: "special offer is deleted from the product" });

                            }
                        });
                        //res.redirect("/specialoffer");   
                    }
                })
            }
        })
    }

});

router.delete("/deleteProduct/:productId",auth, async function (req, res) {
    var tokId = req.user._id;
   if ((req.user._id = "" || null) || (req.user.userType != 'Admin' && req.user.userType != 'Seller' && req.user.userType != 'Both')) {
        res.json({
            sucess: false,
            message: "You must login to delete the special offer"
        });

    } else {
        await Product.findOne({ _id: req.params.productId }, async function (err, productInfo) {
            if (err) {
                throw err;
            }
            else if (productInfo == null || (productInfo.userId.localeCompare(tokId) != 0)) {

                res.json("you cannot delete the special offer");

            } else {

                await SpecialOffer.find({ productId: req.params.productId }, async function (err, specialOfferD) {
                    if (specialOfferD == null) {

                        res.json("you cannot delete the special offer since the offer has not been created yet");
                    } else {
                        /*await SpecialOffer.deleteOne({ productId: req.params.productId }, async function (err, ret) {
                            if (err) {
                                res.json({ sucess: false, message: err });
                            } else {
                                await Product.deleteOne({ _id: req.params.productId }, async function (err, ret) {
                                    if (err) {
                                      res.json({ success: false, message: err });
                                    } 
                                  });
                                res.json({ sucess: true, message: "product is deleted Successfully" });

                            }
                        });*/
                        await Product.updateOne({ _id: req.params.productId }, {
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
                        //res.redirect("/specialoffer");   
                    }
                })
            }
        })
    }

});


router.get("/getPendingSpecialOffer",auth, async function (req, res) {
       var tokId = req.user._id;
     if ((req.user._id = "" || null) || (req.user.userType != 'Admin' && req.user.userType != 'Seller' && req.user.userType != 'Both')) {
        res.status(401).json({
            sucess: false,
            message: "you must log in"
        });
    } else {
        await SpecialOffer.find({ userId: tokId ,status:false}, async function (err, specialOffer) {
            if (err) throw err;
           
           //let foundProducts = [];
           for (let specialoffer of specialOffer) {
               try {
                   let product = await Product.findOne({_id: specialoffer.productId,deleted:false}).exec();
                   var products= {product,specialoffer};
                   foundProducts.push(products);
               } catch(e) {
                   //console.log(`did not find ${specialoffer} in database`);
               }
           }
           //console.log(foundProducts);
           var foundProductsArray = foundProducts;
           foundProducts=[];
           res.status(200).send(foundProductsArray);
           
        });
    }
});

router.get("/getMyActiveSpecialOffer",auth, async function (req, res) {
  var tokId = req.user._id;
  if ((req.user._id = "" || null) || (req.user.userType != 'Admin' && req.user.userType != 'Seller' && req.user.userType != 'Both')) {
    res.status(401).json({
            sucess: false,
            message: "you must log in"
        });
    } else {
        await SpecialOffer.find({ userId: tokId ,status:true}, async function (err, specialOffer) {
            if (err) throw err;

          
           for (let specialoffer of specialOffer) {
                   let product = await Product.findOne({_id: specialoffer.productId,deleted:false}).exec();
                   var products= {product,specialoffer};
                   foundProducts.push(products);
           }
           //console.log(foundProducts);
           var foundProductsArray = foundProducts;
           foundProducts=[];
           res.status(200).send(foundProductsArray);

        });
    }

   

});

router.get("/getAllActiveSpecialOffer", async function (req, res) {
  
   
        await SpecialOffer.find({status:true}, async function (err, specialOffer) {
            if (err) throw err;
           for (let i = 0;i < specialOffer.length;i++) {
                let product = await Product.findOne({_id: specialOffer[i].productId,deleted:false}).exec();
                var specialoffer=specialOffer[i];
                var products= {product,specialoffer};
                foundProducts.push(products);
           }
           //console.log(foundProducts);
           //return foundRiders;
           var foundProductsArray = foundProducts;
           foundProducts=[];
           res.status(200).send(foundProductsArray);

        });

});

router.get("/getActiveSpecialOffer/:offset/:limit", async function (req, res) {
  
    var offset = Number(req.params.offset);
    var limit = Number(req.params.limit);
    
    await SpecialOffer.find({status:true}, async function (err, specialOffer) {
        if (err) throw err;
       for (let i = 0;i < specialOffer.length;i++) {
            let product = await Product.findOne({_id: specialOffer[i].productId,deleted:false}).exec();
            var specialoffer=specialOffer[i];
            var products= {product,specialoffer};
            foundProducts.push(products);
       }
       //console.log(foundProducts);
       //return foundRiders;
       var foundProductsArray = foundProducts;
       foundProducts=[];
       res.status(200).send(foundProductsArray);

    }).sort('-createDate').skip(offset).limit(limit);

});

router.get("/getAllActiveSpecialOfferByCategory/:productCategory", async function (req, res) {
  
   
    await  Product.find({productCategory:req.params.productCategory,deleted:false,specialOfferId:{$ne:null}}, async function (err, productsArray) {
        if (err) throw err;
        for (let i = 0;i < productsArray.length;i++) {
                var productSpecialOfferId = productsArray[i]._id;
                //console.log(productSpecialOfferId);
                let specialoffer = await SpecialOffer.findOne({productId:productSpecialOfferId,status:true}).exec();
                //let specialoffer = specialoffers[0];
                var product=productsArray[i];
                var products= {product,specialoffer};
                if(specialoffer != null){
                    foundProducts.push(products);
                };
               
        }
        //console.log(foundProducts);
        //return foundRiders;
        var foundProductsArray = foundProducts;
        foundProducts=[];
        res.status(200).send(foundProductsArray);

        }).sort('-createDate');

   

});

router.get("/getActiveSpecialOfferByCategory/:productCategory/:offset/:limit", async function (req, res) {
  
    var offset = Number(req.params.offset);
    var limit = Number(req.params.limit);
    
    /*await SpecialOffer.find({status:true}, async function (err, specialOffer) {
        if (err) throw err;
       for (let i = 0;i < specialOffer.length;i++) {
            let product = await Product.findOne({_id: specialOffer[i].productId,productCategory:req.params.productCategory,deleted:false}).exec();
            var specialoffer=specialOffer[i];
            var products= {product,specialoffer};
            foundProducts.push(products);
       }
       console.log(foundProducts);
       //return foundRiders;
       var foundProductsArray = foundProducts;
       foundProducts=[];
       res.send(foundProductsArray);

    }).sort('createDate').skip(offset).limit(limit);*/
   
    await  Product.find({productCategory:req.params.productCategory,deleted:false,specialOfferId:{$ne:null}}, async function (err, productsArray) {
        if (err) throw err;
        for (let i = 0;i < productsArray.length;i++) {
                var productSpecialOfferId = productsArray[i]._id;
                //console.log(productSpecialOfferId);
                let specialoffer = await SpecialOffer.findOne({productId:productSpecialOfferId,status:true}).exec();
                //let specialoffer = specialoffers[0];
                var product=productsArray[i];
                var products= {product,specialoffer};
                if(specialoffer != null){
                    foundProducts.push(products);
                };
               
        }
        //console.log(foundProducts);
        //return foundRiders;
        var foundProductsArray = foundProducts;
        foundProducts=[];
        res.status(200).send(foundProductsArray);

        }).sort('-createDate').skip(offset).limit(limit);

});

router.get("/getAllActiveSpecialOfferBySubCategory/:productSubCategory", async function (req, res) {
  
   
    await  Product.find({productSubCategory:req.params.productSubCategory,deleted:false,specialOfferId:{$ne:null}}, async function (err, productsArray) {
        if (err) throw err;
        for (let i = 0;i < productsArray.length;i++) {
                var productSpecialOfferId = productsArray[i]._id;
                //console.log(productSpecialOfferId);
                let specialoffer = await SpecialOffer.findOne({productId:productSpecialOfferId,status:true}).exec();
                //let specialoffer = specialoffers[0];
                var product=productsArray[i];
                var products= {product,specialoffer};
                if(specialoffer != null){
                    foundProducts.push(products);
                };
               
        }
        //console.log(foundProducts);
        //return foundRiders;
        var foundProductsArray = foundProducts;
        foundProducts=[];
        res.status(200).send(foundProductsArray);

        }).sort('-createDate');
   

});

router.get("/getActiveSpecialOfferBySubCategory/:productSubCategory/:offset/:limit", async function (req, res) {
  
    var offset = Number(req.params.offset);
    var limit = Number(req.params.limit);
   
    /*await SpecialOffer.find({status:true}, async function (err, specialOffer) {
        if (err) throw err;
       for (let i = 0;i < specialOffer.length;i++) {
            let product = await Product.findOne({_id: specialOffer[i].productId,productSubCategory:req.params.productSubCategory,deleted:false}).exec();
            var specialoffer=specialOffer[i];
            var products= {product,specialoffer};
           // if(product !=null){
                foundProducts.push(products);
            //}
            
       }
       console.log(foundProducts);
       //return foundRiders;
       var foundProductsArray = foundProducts;
       foundProducts=[];
       res.send(foundProductsArray);

    }).sort('createDate').skip(offset).limit(limit);*/
    await  Product.find({productSubCategory:req.params.productSubCategory,deleted:false,specialOfferId:{$ne:null}}, async function (err, productsArray) {
        if (err) throw err;
        for (let i = 0;i < productsArray.length;i++) {
                var productSpecialOfferId = productsArray[i]._id;
                //console.log(productSpecialOfferId);
                let specialoffer = await SpecialOffer.findOne({productId:productSpecialOfferId,status:true}).exec();
                //let specialoffer = specialoffers[0];
                var product=productsArray[i];
                var products= {product,specialoffer};
                if(specialoffer != null){
                    foundProducts.push(products);
                };
               
        }
        //console.log(foundProducts);
        //return foundRiders;
        var foundProductsArray = foundProducts;
        foundProducts=[];
        res.status(200).send(foundProductsArray);

        }).sort('-createDate').skip(offset).limit(limit);
});

router.get("/getProductInSpecialOffer/:productId", async function (req, res) {

        if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
            return res.status(400).send('Invalid Id.');
        }
  
        await SpecialOffer.findOne({ productId: req.params.productId ,status:true}, async function (err, specialOffer) {
            if (err) throw err;

           //let foundProducts = [];
          
               try {
                   let product = await Product.findOne({_id: specialOffer.productId,deleted:false}).exec();
                   var products= {product,specialOffer};
                   foundProducts.push(products);
               } catch(e) {
                   //console.log(`did not find ${specialOffer} in database`);
               }
         
           //console.log(foundProducts);
           var foundProductsArray = foundProducts;
           foundProducts=[];
           res.status(200).send(foundProductsArray);

        });
 

});


module.exports = router;
