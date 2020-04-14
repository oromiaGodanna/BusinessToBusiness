import { ObjectId } from "bson";
export { };
var mongoose = require('mongoose');
var objectId = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var { Proforma, Item, Response, validateItem, validateResponse } = require('../models/proforma');
const Customer = require('../models/customer');
const {Notification} = require('../models/notification');

router.use(bodyParser.json());

router.use(function (req, res, next) {
  var token = {
    userId: "5e85f695a168ad33bc928193",
    cartId: "5e609e9a06cd2d1614e84d5e",
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

router.post("/createProforma", function (req, res) {
  var proforma = Proforma();
  proforma.userId = req.token.userId;
  proforma.startDate = req.body.startDate;
  proforma.endDate = req.body.endDate;
  proforma.maxResponse = req.body.maxResponse;
  proforma.response = req.body.response;


  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to create proforma"
    });

  } else {

    /*if(req.body.items != null){
        const { error } = validateItem(req.body.items);
    if (error) return res.status(400).send(error.details[0].message);
    }*/

    proforma.save(function (err, proformaCreated) {
      if (err) {
        res.json({ sucess: false, message: err });
      } else {
        if (req.body.items != null) {

          res.redirect(307, "addItem/" + proformaCreated._id);

        } else {
          res.json({ sucess: true, message: "proforma added" + proformaCreated });
        }

        //res.json({ sucess: true, message: "proforma added" + proformaCreated});
      }
    });


  }
});

//request proforma
router.post("/requestProforma/:proformaId", function (req, res) {

  const tok = req.token.userId;
  if ((req.token.userId = "" || (req.token.userId = null))) {
    res.json({
      sucess: false,
      message: "You must login to send proforma to sellers"
    });

  } else {

    Proforma.findOne({ _id: req.params.proformaId }, function (err, proforma) {
      if (err) {
        throw err;

      } else if (proforma == null) {
        res.json({ sucess: true, message: "proforma not found" });

      } else if (proforma.userId != tok) {
        //console.log(tok);
        res.send("you cannot send requests regarding the proforma");

      } else {

        Proforma.updateOne({ _id: req.params.proformaId }, {
          $set: {

            startDate: Date.now(),
            endDate: req.body.endDate,
            status: true

          }
        }, function (err, proformaUpdated) {
          if (err) {
            res.json({ sucess: false, message: err });
          } else {
            var customer = [];
            var notification = Notification();
            notification.notificationType = "Proforma";
            notification.date = Date.now();
            notification.title = "proforma request";
            notification.content = "checkout the proforma details if you wanna participate";
            Customer.find({/*"subscriptionCounter.numberOfQuotations"*/subscriptionCounter : !null && !(0) },function(req,cust){
              if (err) {
                res.json({ sucess: false, message: err });
              } else {
                for (let i = 0; i < cust.length; i++) {
                    customer.push(cust[i]._id);
                }
                notification.recipients = customer;
                notification.save(function (err, notified){
                  res.json({ sucess: true, message: "the request is successful" });
                });
               
              }
            })
            //res.json({ sucess: true, message: proformaUpdated });
          }
          //res.redirect("/products");
        });
      }
      ////////create notification
    })

  }
});

//get all the proformas created by the user who has logged in
router.get("/getProforma/:proformaId", function (req, res) {

  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get the profroma"
    });

  } else {

    Proforma.find({ _id: req.params.proformaId }, function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    });

  }
})
//get all the proformas created by the user who has logged in
router.get("/getProformas", function (req, res) {

  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get proformas you created"
    });

  } else {

    Proforma.find({}, function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    }).sort('createDate');

  }
});
//get all the proformas created by the user who has logged in
router.get("/getMyProformas", function (req, res) {

  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get proformas you created"
    });

  } else {

    Proforma.find({ userId: req.token.userId }, function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    }).sort('createDate');

  }
});

//close proforma
router.post("/closeProforma/:proformaId", function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to close the proformas"
    });

  } else {

    Proforma.findOne({ _id: req.params.proformaId }, function (err, proformaD) {
      if (err) {
        throw err;

      } else if (proformaD == null) {
        res.json({ sucess: true, message: "proforma not found" });

      } else if (proformaD.userId != tok) {
        console.log(req.token.userId);
        res.send("you cannot close the proforma");

      } else {
        Proforma.updateOne({ _id: req.params.proformaId }, {
          $set: {

            endDate: Date.now(),
            status: false

          }
        }, function (err, proformaUpdated) {
          if (err) {
            res.json({ sucess: false, message: err });
          } else {
            res.json({ sucess: true, message: proformaUpdated });
          }
          //res.redirect("/products");
        });
      }
    })

  }
});

//delete proforma
router.get("/deleteProforma/:proformaId", function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to close the proformas"
    });

  } else {

    Proforma.findOne({ _id: req.params.proformaId }, function (err, proformaD) {
      if (err) {
        throw err;

      } else if (proformaD == null) {
        res.json({ sucess: true, message: "proforma not found" });

      } else if (proformaD.userId != tok) {

        res.send("you cannot delete the proforma");

      } else {
        Proforma.deleteOne({ _id: req.params.proformaId }, function (err, ret) {
          if (err) {
            res.json({ sucess: false, message: err });
          } else {
            res.json({ sucess: true, message: "proforma deleted" });
          }
        });
        //res.redirect("/products");  
      }
    })

  }
});

router.post("/addItem/:proformaId", function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to add item to the profoma"
    });

  } else {
    //var pId = req.params.proformaId.slice(1);
    Proforma.findOne({ _id: req.params.proformaId }, function (err, pr) {
      if (err) {
        throw err;

      } else if (pr == null || pr.userId != tok) {
        res.send("you cannot add item to proforma");
      } else {

        for (var i = 0; i < req.body.items.length; i++) {
          var item = Item();
          item.proformaId = req.params.proformaId;
          item.categoryId = req.body.items[i].categoryId;
          item.subCategory = req.body.items[i].subCategory;
          item.description = req.body.items[i].description;
          item.quantity = req.body.items[i].quantity;

          Proforma.updateOne({ _id: req.params.proformaId }, {
            $addToSet: {
              items: item
            }
          }, function (err, prUpdate) {
            if (err) {
              res.json({ sucess: false, message: err });
            }
          })
        }
        res.json({ sucess: true, message: "item is added" });
      }

    })

  }
});

router.get("/getItem/:itemId", function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    Proforma.findOne({ "items._id": req.params.itemId }, function (err, proformaD) {
      if (err) {
        throw err;
      } else if (proformaD == null) {

        res.send("no item found.");
      } else {
        // console.log(product);
        for (let i = 0; i < proformaD.items.length; i++) {
          if (proformaD.items[i]._id == req.params.itemId) {
            res.send(proformaD.items[i]);
          }

        }
      }
    });
  }
});

router.get("/getItems/:proformaId", function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    Proforma.findOne({ _id: req.params.proformaId }, function (err, proformaD) {
      if (err) {
        throw err;
      } else if (proformaD == null) {

        res.send("no items found.");
      } else {
        res.send(proformaD.items);
      }
    });

  }


});

router.post("/sendResponse", function (req, res) {
  var response = Response();
  response.userId = req.token.userId;
  response.itemId = req.body.itemId;
  response.unitPrice = req.body.unitPrice;
  const tok = req.token.userId;

  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must login in to respond to proforma"
    });

  } else {

    //var pId = req.params.proformaId.slice(1);
    Proforma.findOne({ "items._id": req.body.itemId }, function (err, proforma) {
      if (err) {
        throw err;

      } else if (proforma == null || proforma.status == false) {

        res.json({ sucess: true, message: "response cannot be sent. The profroma doesnot exist or it is not open yet" });

      } else {

        if (proforma.response != null) {

          for (let i = 0; i < proforma.response.length; i++) {

            if (proforma.response[i].userId == tok && proforma.response[i].itemId == req.body.itemId) {
              Proforma.updateOne({ _id: proforma._id }, {
                $set: {
                  [`response.${i}`]: response
                }
              }, function (err, resUpdate) {
                if (err) {
                  res.json({ sucess: false, message: err });
                }
                res.json({ sucess: true, message: "Response is updated" });

              })
              break;
            }
            else if (i == (proforma.response.length - 1)) {
              Proforma.updateOne({ _id: proforma._id }, {
                $addToSet: {
                  response: response
                }
              }, function (err, resUpdate) {
                if (err) {
                  res.json({ sucess: false, message: err });
                }
                res.json({ sucess: true, message: "Response is Added" });
              })
            }

          }

        }

      }
    })
  }
});
//get response
router.get("/getResponse/:responseId", function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    Proforma.findOne({ "response._id": req.params.responseId }, function (err, proformaD) {
      if (err) {
        throw err;
      } else if (proformaD == null) {

        res.send("no response found.");
      } else {
        // console.log(product);
        for (let i = 0; i < proformaD.response.length; i++) {
          if (proformaD.response[i]._id == req.params.responseId) {
            res.send(proformaD.response[i]);
          }

        }
      }
    });
  }
});
//get responses
router.get("/getResponses/:proformaId", function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    Proforma.findOne({_id: req.params.proformaId, userId:req.token.userId }, function (err, proformaD) {
      if (err) {
        throw err;
      } else if (proformaD == null) {

        res.send("no response found.");
      } else {
        
        res.send(proformaD.response);
      }
    });
  }
});
module.exports = router;