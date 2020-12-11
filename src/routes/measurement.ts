export { };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Measurement} = require('../models/measurement');
const mongoose = require('mongoose');

const { Customer, Buyer, Seller, Both,  DeleteRequest, validateCustomer, validateBuyer, validateSeller, validateBoth, validateDeleteRequest } = require('../models/customer');//const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');


router.use(bodyParser.json());


router.post("/addMeasurement",auth, async function (req, res) {
  var measurement = Measurement();
  measurement.name = req.body.measurementName;
  
  if ((req.user._id = "" || null) || (req.user.userType != 'Admin')) {
    res.status(401).json({
      sucess: false,
      message: "You must to login to add Measurement and you must be admin"
    });

  } else {

    if (req.body.measurementName == null || req.body.measurementName == "") {
      res.status(400).json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      
      await measurement.save(async function (err,measurementCreated) {
        if (err) {
          res.status(500).json({ sucess: false, message: err });
        } else {
          res.status(200).json({ sucess: true, message: measurementCreated });
        }
      });
    }
  }
});

router.post("/editMeasurement/:id",auth, async function (req, res) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid Id.');
  }

  const tok = req.user._id;
  if ((req.user._id = "" || null) || (req.user.userType != 'Admin')) {
    res.status(401).json({
      sucess: false,
      message: "You must to login to update Measurement and you must be admin"
    });

  } else {

    if (req.body.measurementName == null || req.body.measurementName == "" ) {
      res.status(400).json({
        sucess: false,
        message: "Ensure all fields are provided"
      });
    } else {
      //console.log(tok);
     await Measurement.findOne({ _id: req.params.id }, async function (err, measurement) {
        if (err) {
          throw err;
  
        }else if(measurement == null){
          res.status(404).json({ sucess: true, message: "Measurement not found" });
  
        }else {

         await Measurement.updateOne({ _id: req.params.id }, {
            $set: {

              name: req.body.measurementName,
             
            }
          }, async function (err, measurementD) {
            if (err) {
              res.status(500).json({ sucess: false, message: err });
            } else {
              res.status(200).json({ sucess: true, message: measurementD } );
            }
            //res.redirect("/products");
          });
        }
      })
    }
  }
});

router.get("/getMeasurements",auth, async function (req, res) {
    
        await Measurement.find({}, async function (err, measurements) {
            if (err) throw err;
            res.status(200).send(measurements);
        }).sort('-createDate');
      
});

router.get("/getMeasurement/:id",auth, async function (req, res) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid Id.');
  }

  if ((req.user._id = "" || null) || (req.user.userType != 'Admin' && req.user.userType != 'Seller' && req.user.userType != 'Both')) {
         res.status(401).json({
          sucess: false,
          message: "You must to login to get Measurement and you must be admin"
        });
    
      } else {
            Measurement.findOne({ _id: req.params.id }, async function (err, measurement) {
            if (err) {
            throw err;
            } else if (measurement == null) {
              res.status(404).send("measurement not found");
            } else {
              res.status(200).send(measurement);
            }
    });
    }
});

router.delete("/deleteMeasurement/:id",auth, async function (req, res) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid Id.');
  }

  //const tok = req.token.userId;
 if ((req.user._id = "" || null) || (req.user.userType != 'Admin')) {
    res.status(401).json({
      sucess: false,
      message: "You must to login to delete the Measurement and you must be admin"
    });

  } else {
    await Measurement.findOne({ _id: req.params.id }, async function (err, measurement) {
      if (err) {
        throw err;

      }else if(measurement == null){
        res.status(404).json({ sucess: true, message: "Measurement not found" });

      }else {
       
       await Measurement.deleteOne({ _id: req.params.id }, async function (err, ret) {
          if (err) {
            res.status(500).json({ sucess: false, message: err });
          } else {
            res.status(200).json({ sucess: true, message: "Measurement deleted" });
          }
        });
        //res.redirect("/products");  
      }
    })
  }

});

module.exports = router;
