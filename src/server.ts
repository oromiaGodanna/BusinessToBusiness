export {};
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const stripe = require("stripe")("sk_test_51HJ1IYKh0KNnlGFstXGy55rb5I25EORqC3dvHEoNsocIowXF8RVPnEzbodvuzCYpgTw5JxCFp13ZkfEchtC5DHP20054VxgU6y");
const cors = require('cors');


const order = require('./routes/order');
const payment = require('./routes/payment')

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

mongoose.connect('mongodb://localhost/b2b', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected to mongoDB...')})
  .catch( err => console.error('Could not connect to mongoDB....'));

app.get("/", (req, res) => {
    res.send("Hello World!!!")
})

app.use(express.json());
app.use(cors(corsOptions));
app.use('/order', order);
app.use('/payment', payment);

(async ()=>{
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1099,
  currency: 'usd',
  // Verify your integration in this guide by including this parameter
  metadata: {integration_check: 'accept_a_payment'},
});
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
});


