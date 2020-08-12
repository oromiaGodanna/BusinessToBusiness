export { };

require('dotenv').config();
const express = require('express');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
// Joi = Joi.extend(require('joi-phone-number'));
const Fawn = require('fawn');
const error = require('./middleware/error');
require('express-async-errors');
const winston = require('winston');
// require('winston-mongodb');
const config = require('config');

const message = require('./routes/message');
const promotion = require('./routes/promotion');
const notification = require('./routes/notification');
const customer = require('./routes/customer');
const auth = require('./routes/auth');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;


// winston.exceptions.handle(
//   new winston.transports.Console({ colorize: true, prettyPrint: true }),
//   new winston.transports.File({ filename: 'uncaughtExceptions.log' })
// );

// process.on('unhandledRejection', (ex) => {
//   throw ex;
// })

// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'logfile.log' })
//   ]
// });

// winston.add(new winston.transports.File, { filename: 'logfile.log' });
// winston.add(new winston.transports.MongoDB, {
//   db: 'mongodb://localhost/b2b',
//   level: 'info'
// });


// Allowing cross-origin sites to make requests to this API
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append("Access-Control-Allow-Headers", "x-auth-token,Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.append('Access-Control-Allow-Credentials', true);
  next();
});

mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => { console.log(`Connected to mongoDB: ${config.get('db')}...`) })
  .catch(err => console.error('Could not connect to mongoDB....'));


Fawn.init(mongoose);

app.get('/', (req, res) => {
  res.send('business to business ecommerce');
});

app.use(express.json());
app.use('/messages', message);
app.use('/promotions', promotion);
app.use('/notifications', notification);

app.use('/customers', customer);
app.use('/auth', auth);
app.use(error);


const server = app.listen(port, () => {
  return console.log(`server is listening on ${port}...`);
});


module.exports = server;