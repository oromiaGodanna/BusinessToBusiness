export {};

const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Fawn = require('fawn');

const message = require('./routes/message');
const promotion = require('./routes/promotion');
const notification = require('./routes/notification');
const customer = require('./routes/customer');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/b2b', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected to mongoDB...')})
  .catch( err => console.error('Could not connect to mongoDB....'));

  
Fawn.init(mongoose);

app.get('/', (req, res) => {
  res.send('business to business ecommerce');
});

app.use(express.json());
app.use('/messages', message);
app.use('/promotions', promotion);
app.use('/notifications', notification);

app.use('/customers', customer);


app.listen(port, () => {
  return console.log(`server is listening on ${port}...`);
});