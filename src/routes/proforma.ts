export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var { Proforma, Item, Response, validateItem, validateResponse, validateProforma } = require('../models/proforma');
const Customer = require('../models/customer');
const { Notification } = require('../models/notification');

router.use(bodyParser.json());

router.use(function (req, res, next) {
  var token = {
    userId: "5e85f695a168ad33bc928193"
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

router.post("/createProforma", async function (req, res) {

  const itemsObj = req.body.items;
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

    const { error } = validateProforma(req.body);
    if (error) {
      //return res.status(400).send(error.details[0].message);
      res.json({ sucess: true, message: error.details[0].message });
    } else {

      await proforma.save(async function (err, proformaCreated) {
        if (err) {
          res.json({ sucess: false, message: err });
        } else {
          if (req.body.items != null) {

           // res.redirect(307, "addItem/" + proformaCreated._id);
           
          
              await Proforma.findOne({ _id: proformaCreated._id,userId:req.token.userId }, async function (err, pr) {
                if (err) {
                   throw err;
                }else {
                  for (var i = 0; i < itemsObj.length; i++) {
                    var item = Item();
                    item.proformaId = proformaCreated._id;
                    item.category = itemsObj[i].category;
                    item.subCategory = itemsObj[i].subCategory;
                    item.description = itemsObj[i].description;
                    item.quantity = itemsObj[i].quantity;

                    await Proforma.updateOne({ _id: proformaCreated._id }, {
                      $addToSet: {
                        items: item
                      }
                    }, function (err, prUpdate) {})
                  }
                  res.json({ sucess: true, message: "item is added" });
                }

              })

          } else {
            res.json({ sucess: true, message: "proforma added" + proformaCreated });
          }
        }
      });

    }
  }
});

//request proforma
router.post("/requestProforma/:proformaId", async function (req, res) {

  const tok = req.token.userId;
  if ((req.token.userId = "" || (req.token.userId = null))) {
    res.json({
      sucess: false,
      message: "You must login to send proforma to sellers"
    });

  } else {

    await Proforma.findOne({ _id: req.params.proformaId }, async function (err, proforma) {
      if (err) {
        throw err;

      } else if (proforma == null || proforma.items == null) {
        res.json({ sucess: true, message: "proforma not found or the proforma doesnot contain items" });

      } else if (proforma.userId != tok) {
        //console.log(tok);
        res.send("you cannot send requests regarding the proforma");

      } else {

        await Proforma.updateOne({ _id: req.params.proformaId }, {
          $set: {

            startDate: Date.now(),
            endDate: req.body.endDate,
            status: true

          }
        }, async function (err, proformaUpdated) {
          if (err) {
            res.json({ sucess: false, message: err });
          } else {
            var customer = [];
            var notification = Notification();
            notification.notificationType = "Proforma";
            notification.date = Date.now();
            notification.title = "proforma request";
            notification.content = "checkout the proforma details if you wanna participate";
            await Customer.find({/*"subscriptionCounter.numberOfQuotations"*/subscriptionCounter: !null && !(0) }, async function (req, cust) {
              if (err) {
                res.json({ sucess: false, message: err });
              } else {
                for (let i = 0; i < cust.length; i++) {
                  customer.push(cust[i]._id);
                }
                notification.recipients = customer;
                notification.save(function (err, notified) {
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

//get the proforma
router.get("/getProforma/:proformaId", async function (req, res) {

  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get the profroma"
    });

  } else {

    await Proforma.findOne({ _id: req.params.proformaId,status:true,closed:false }, async function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    });

  }
})
///
///
///to be deleted soon
//get all the proformas created by the user
router.get("/getProformas", async function (req, res) {

  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get proformas you created"
    });

  } else {

    await Proforma.find({}, async function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    }).sort('createDate');

  }
});
//get all the proformas created by the user who has logged in
router.get("/getMyProformas", async function (req, res) {
  const tokenUserId = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get proformas you created"
    });

  } else {
   
    await Proforma.find({ userId: tokenUserId }, async function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    }).sort('createDate');

  }
});
//get all the pending proforma created by the user who has logged in
router.get("/pendingProforma", async function (req, res) {
  const tokenUserId = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get proformas you created"
    });

  } else {
   
    await Proforma.find({ userId: tokenUserId,status:false,closed:false}, async function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    }).sort('createDate');

  }
});

//get all the active proforma created by the user who has logged in
router.get("/activeProforma", async function (req, res) {
  const tokenUserId = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get proformas you created"
    });

  } else {
   
    await Proforma.find({ userId: tokenUserId,status:true,closed:false}, async function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    }).sort('createDate');

  }
});

//get all the closed proforma created by the user who has logged in
router.get("/closedProforma", async function (req, res) {
  const tokenUserId = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to get proformas you created"
    });

  } else {
   
    await Proforma.find({ userId: tokenUserId,closed:true}, async function (err, proforma) {
      if (err) throw err;
      res.send(proforma);
    }).sort('createDate');

  }
});



//close proforma
router.get("/closeProforma/:proformaId", async function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to close the proformas"
    });

  } else {

    await Proforma.findOne({ _id: req.params.proformaId }, async function (err, proformaD) {
      if (err) {
        throw err;

      } else if (proformaD == null) {
        res.json({ sucess: true, message: "proforma not found" });

      } else if (proformaD.userId != tok) {
        console.log(req.token.userId);
        res.send("you cannot close the proforma");

      } else {
        await Proforma.updateOne({ _id: req.params.proformaId }, {
          $set: {

            endDate: Date.now(),
            status: false,
            closed:true

          }
        }, async function (err, proformaUpdated) {
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
router.delete("/deleteProforma/:proformaId", async function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to close the proformas"
    });

  } else {

    await Proforma.findOne({ _id: req.params.proformaId }, async function (err, proformaD) {
      if (err) {
        throw err;

      } else if (proformaD == null) {
        res.json({ sucess: true, message: "proforma not found" });

      } else if (proformaD.userId != tok) {

        res.send("you cannot delete the proforma");

      } else {
        await Proforma.deleteOne({ _id: req.params.proformaId }, async function (err, ret) {
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

router.post("/addItem/:proformaId", async function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId = "" || null)) {
    res.json({
      sucess: false,
      message: "You must to login to add item to the profoma"
    });

  } else {
    const { error } = validateItem(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);

    } else {
      await Proforma.findOne({ _id: req.params.proformaId }, async function (err, pr) {
        if (err) {
          //throw err;
          res.send("error: "+err);

        } else if (pr == null || pr.userId != tok) {
          res.send("you cannot add item to proforma");
        } else {
          if (req.body.items == null || req.body.items == "") {
            res.send("no item found");
          }
          for (var i = 0; i < req.body.items.length; i++) {
            var item = Item();
            item.proformaId = req.params.proformaId;
            item.category = req.body.items[i].category;
            item.subCategory = req.body.items[i].subCategory;
            item.description = req.body.items[i].description;
            item.quantity = req.body.items[i].quantity;

            await Proforma.updateOne({ _id: req.params.proformaId }, {
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
  }
});

router.get("/getItem/:itemId", async function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    await Proforma.findOne({ "items._id": req.params.itemId }, async function (err, proformaD) {
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

router.get("/getItems/:proformaId", async function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    await Proforma.findOne({ _id: req.params.proformaId }, async function (err, proformaD) {
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

router.post("/sendResponse", async function (req, res) {
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
    const { error } = validateResponse(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);

    } else {
    await Proforma.findOne({ "items._id": req.body.itemId }, async function (err, proforma) {
      if (err) {
        throw err;

      } else if (proforma == null || proforma.status == false) {

        res.json({ sucess: true, message: "response cannot be sent. The profroma doesnot exist or it is not open yet" });

      } else {

        if (proforma.response == null || proforma.response == "") {

          Proforma.updateOne({ _id: proforma._id }, {
            $addToSet: {
              response: response
            },
            maxResponse: proforma.maxResponse - 1
          }, async function (err, resUpdate) {
            if (err) {
              res.json({ sucess: false, message: err });
            }
            res.json({ sucess: true, message: "Response is Added" });
          })
        }
        else {

          Proforma.updateOne({ _id: proforma._id }, {
            $push: { response: response },
            maxResponse: proforma.maxResponse - 1
          }, async function (err, resUpdate) {
            if (err) {
              res.json({ sucess: false, message: err });
            }
            res.json({ sucess: true, message: "Response is updated" });

          })

        }

      }
    })
  }
  }
});
//get response
router.get("/getResponse/:responseId", async function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    await Proforma.findOne({ "response._id": req.params.responseId }, async function (err, proformaD) {
      if (err) {
        throw err;
      } else if (proformaD == null) {

        res.send("no response found.");
      } else {
        // console.log(product);
        for (let i = 0; i < proformaD.response.length; i++) {
          if (proformaD.response[i]._id == req.params.responseId) {
            res.send(proformaD.response[i]);
            break;
          }

        }
      }
    });
  }
});
//get responses
router.get("/getProformaResponses/:proformaId", async function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    await Proforma.findOne({ _id: req.params.proformaId, userId: req.token.userId }, async function (err, proformaD) {
      if (err) {
        throw err;
      } else if (proformaD == null) {

        res.send("no response found.");
      } else {

        var userData=[{
                      username:'eyerus zewdu',
                      type:'seller',
                      firstname:"eyerus",
                      lastname:"zewdu"
                    },{
                      username:'eyerus zewdu',
                      type:'buyer',
                      firstname:"eyerus",
                      lastname:"zewdu"
                    }]

        res.send({
          response: proformaD.response,
          items: proformaD.items,
          users:userData
        });

        //res.send(proformaD.response);
      }
    });
  }
});

//get responses
router.get("/getResponses/:itemId", async function (req, res) {
  if (req.token.userId == "" || req.token.userId == null) {
    res.json({
      sucess: false,
      message: "you must log in"
    });
  } else {

    await Proforma.findOne({ "response.itemId": req.params.itemId, "items._id": req.params.itemId, userId: req.token.userId }, async function (err, proformaD) {
      if (err) {
        throw err;
      } else if (proformaD == null) {

        res.send("no response found.");
      } else {
          var userData=[{
            username:'eyerus zewdu',
            type:'seller',
            firstname:"eyerus",
            lastname:"zewdu"
          },{
            username:'eyerus zewdu',
            type:'buyer',
            firstname:"eyerus",
            lastname:"zewdu"
          }]

          res.send({
          response: proformaD.response,
          items: proformaD.items,
          users:userData
          });
        //res.send(proformaD.response);
      }
    });
  }
});

module.exports = router;