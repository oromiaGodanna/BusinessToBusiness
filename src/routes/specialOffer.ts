import { ObjectId } from "bson";
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Product = require('../models/product');
const SpecialOffer = require('../models/specialOffer');
//const WishList = require('../models/wishList');
//const User = require('../models/User');
//const mongoose = require('mongoose');

router.use(bodyParser.json());

router.use(function (req, res, next) {
    var token = {
        userId: "user12143",
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

router.post("/createSpecialOffer", function (req, res) {
    var specialOffer = SpecialOffer();
    specialOffer.productId = req.body.productId;
    specialOffer.title = req.body.title;
    specialOffer.startDate = req.body.startDate;
    specialOffer.endDate = req.body.endDate;
    specialOffer.discount = req.body.discount;
    //specialOffer.status = req.body.status;

    if ((req.token.userId = "" || null) || (req.token.userType.localeCompare("seller"))) {
        res.json({
            sucess: false,
            message: "You must to login to add special offer to product"
        });

    } else {

        Product.findOne({ productId: req.body.productId }, function (err, productInfo) {
            if (err) {
                throw err;
            }
            //|| (productInfo.userId.localeCompare(req.token.userId) )
            else if ((productInfo == null)) {
                res.json({
                    sucess: false,
                    message: "Sorry,The product you wish to add special offer to, is not found"
                });
            } else {
                specialOffer.specialOfferId = "1";
                //specialOffer.specialOfferId = productInfo.specialOfferId;
                SpecialOffer.findOne({ specialOfferId: specialOffer.specialOfferId }, function (err, specialOfferD) {
                    if (err) {
                        throw err;
                    }
                    else if (specialOfferD != null) {
                        res.json({
                            sucess: false,
                            message: "The product is already on special offer"
                        });
                    }
                    else {
                        specialOffer.save(function (err, specialOffer) {
                            if (err) {
                                res.json({ sucess: false, message: err });
                            } else {
                                //res.json(specialOffer);
                                res.json({ sucess: true, message: specialOffer + "/n" + "special offer to the product is added.Click open if you wish to open it" });
                            }
                        });
                    }
                })

            }

        });
    }
});

router.post("/openSpecialOffer/:specialOfferId", function (req, res) {

    if ((req.token.userId = "" || null) || (req.token.userType.localeCompare("seller"))) {
        res.json({
            sucess: false,
            message: "You must login to open special offer"
        });

    } else {

        Product.findOne({ specialOfferId: req.params.specialOfferId }, function (err, productInfo) {
            if (err) {
                throw err;
            }
            else if (productInfo.userId != req.token.userId) {

                res.json("you cannot open the special offer");

            } else {

                SpecialOffer.findOne({ specialOfferId: req.params.specialOfferId }, function (err, specialOfferD) {
                    if (specialOfferD == null) {

                        res.json("you cannot open the special offer since the offer has not created yet");
                    } else {

                        var startDateGiven = Date.now();
                        if (req.body.startDate != null) {
                            startDateGiven = req.body.startDate;
                        }
                        SpecialOffer.updateOne({ specialOfferId: req.body.specialOfferId }, {
                            $set: {

                                startDate: startDateGiven,

                            }
                        }, function (err, specialOffer) {
                            if (err) {
                                res.json({ sucess: false, message: err });
                            } else {
                                if (req.body.startDate == null) {
                                    res.json(specialOffer.startDate);
                                }
                                res.json({ sucess: true, message: "special offer is open now" });
                            }
                            //res.redirect("/products");
                        });
                    }
                })


            }
        })
    }
});

router.post("/closeSpecialOffer/:specialOfferId", function (req, res) {

    if ((req.token.userId = "" || null) || (req.token.userType.localeCompare("seller"))) {
        res.json({
            sucess: false,
            message: "You must login to close special offer or you need to the product seller"
        });

    } else {

        Product.findOne({ specialOfferId: req.params.specialOfferId }, function (err, productInfo) {
            if (err) {
                throw err;
            }
            else if (productInfo.userId != req.token.userId) {

                res.json("you cannot close the special offer");

            } else {

                SpecialOffer.findOne({ specialOfferId: req.params.specialOfferId }, function (err, specialOfferD) {
                    if (specialOfferD == null) {

                        res.json("you cannot close the special offer since the offer has not created yet");
                    } else {

                        var endDateGiven = Date.now();
                        if (req.body.endDate != null) {
                            endDateGiven = req.body.endDate;
                        }
                        SpecialOffer.updateOne({ specialOfferId: req.body.specialOfferId }, {
                            $set: {

                                endDate: endDateGiven,

                            }
                        }, function (err, specialOffer) {
                            if (err) {
                                res.json({ sucess: false, message: err });
                            } else {
                                if (req.body.endDate == null) {
                                    res.json(specialOffer.endDate);
                                }
                                res.json({ sucess: true, message: " The special offer is closed now" });
                            }
                            //res.redirect("/products");
                        });
                    }
                })


            }
        })
    }
});

router.get("/deleteOffer/:specialOfferId", function (req, res) {

    if ((req.token.userId = "" || null) || (req.token.userType.localeCompare("seller"))) {
        res.json({
            sucess: false,
            message: "You must login to delete the special offer"
        });

    } else {
        Product.findOne({ specialOfferId: req.params.specialOfferId }, function (err, productInfo) {
            if (err) {
                throw err;
            }
            else if (productInfo.userId != req.token.userId) {

                res.json("you cannot delete the special offer");

            } else {

                SpecialOffer.findOne({ specialOfferId: req.params.specialOfferId }, function (err, specialOfferD) {
                    if (specialOfferD == null) {

                        res.json("you cannot delete the special offer since the offer has not been created yet");
                    } else {
                        SpecialOffer.deleteOne({ specialOfferId: req.params.specialOfferId }, function (err, ret) {
                            if (err) {
                                res.json({ sucess: false, message: err });
                            } else {
                                res.json({ sucess: true, message: "special offer deleted" });
                            }
                        });
                        //res.redirect("/specialoffer");   
                    }
                })
            }
        })
    }

});

module.exports = router;
