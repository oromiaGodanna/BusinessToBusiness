export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var {Measurement} = require('../models/measurement');
//const User = require('../models/User');
//const Order = require('../models/order');
const mongoose = require('mongoose');

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

router.post("/addMeasurement", async function (req, res) {
  var measurement = Measurement();
  measurement.name = req.body.measurementName;
  
  if ((req.token.userId = "" || null) || (req.token.userType.localeCompare("admin"))) {
    res.json({
      sucess: false,
      message: "You must to login to add Measurement and you must be admin"
    });

  } else {

    if (req.body.measurementName == null || req.body.measurementName == "") {
      res.json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      
      await measurement.save(async function (err,measurementCreated) {
        if (err) {
          res.json({ sucess: false, message: err });
        } else {
           res.json({ sucess: true, message: measurementCreated });
        }
      });
    }
  }
});

router.post("/editMeasurement/:id", async function (req, res) {

  const tok = req.token.userId;
  if ((req.token.userId = "" || (req.token.userId = null)) || (req.token.userType.localeCompare("admin"))) {
    res.json({
      sucess: false,
      message: "You must to login to update Measurement and you must be admin"
    });

  } else {

    if (req.body.measurementName == null || req.body.measurementName == "" ) {
      res.json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      //console.log(tok);
     await Measurement.findOne({ _id: req.params.id }, async function (err, measurement) {
        if (err) {
          throw err;
  
        }else if(measurement == null){
          res.json({ sucess: true, message: "Measurement not found" });
  
        }else {

         await Measurement.updateOne({ _id: req.params.id }, {
            $set: {

              name: req.body.measurementName,
             
            }
          }, async function (err, measurementD) {
            if (err) {
              res.json({ sucess: false, message: err });
            } else {
              res.json({ sucess: true, message: measurementD } );
            }
            //res.redirect("/products");
          });
        }
      })
    }
  }
});

router.get("/getMeasurements", async function (req, res) {
    if ((req.token.userId = "" || (req.token.userId = null)) || (req.token.userType.localeCompare("admin"))) {
        res.json({
          sucess: false,
          message: "You must to login to get Measurement and you must be admin"
        });
    
      } else {
        await Measurement.find({}, async function (err, measurements) {
            if (err) throw err;
            res.send(measurements);
        }).sort('createDate');
      }
});

router.get("/getMeasurement/:id", async function (req, res) {
    if ((req.token.userId = "" || (req.token.userId = null)) || (req.token.userType.localeCompare("admin"))) {
        res.json({
          sucess: false,
          message: "You must to login to get Measurement and you must be admin"
        });
    
      } else {
            Measurement.findOne({ _id: req.params.id }, async function (err, measurement) {
            if (err) {
            throw err;
            } else if (measurement == null) {
            res.send("measurement not found");
            } else {
            res.send(measurement);
            }
    });
    }
});

router.delete("/deleteMeasurement/:id", async function (req, res) {
  const tok = req.token.userId;
  if ((req.token.userId=="" || null) || (req.token.userType.localeCompare("admin"))) {
    res.json({
      sucess: false,
      message: "You must to login to delete the Measurement and you must be admin"
    });

  } else {
    await Measurement.findOne({ _id: req.params.id }, async function (err, measurement) {
      if (err) {
        throw err;

      }else if(measurement == null){
        res.json({ sucess: true, message: "Measurement not found" });

      }else {
       
       await Measurement.deleteOne({ _id: req.params.id }, async function (err, ret) {
          if (err) {
            res.json({ sucess: false, message: err });
          } else {
            res.json({ sucess: true, message: "Measurement deleted" });
          }
        });
        //res.redirect("/products");  
      }
    })
  }

});

module.exports = router;
