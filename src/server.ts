import * as express from "express";
import { nextTick } from "process";
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const config = require('config');
require('dotenv').config();
const error = require('./middleware/error');

const customer = require('./routes/customer');
const user = require('./routes/user');
const subscription = require('./routes/subscription');
const task = require('./routes/task');
const report = require('./routes/report');
const country = require('./routes/country');

if(!process.env.jwtPrivateKey){
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/b2b', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected to mongoDB...')})
  .catch( err => console.error('Could not connect to mongoDB....'));


app.use(bodyParser.json());

app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
if('OPTIONS' == req.method){
  res.sendStatus(200);
}else {
  console.log(`${req.ip} ${req.message} ${req.url}`);
  next();
}
});


app.use('/customer', customer);
app.use('/user', user);
app.use('/subscription', subscription);
app.use('/tasks', task);
app.use('/report', report);
app.use('/countries', country);

app.use(error);

app.get("/hello", (req, res) => {
  console.log("client call")
    //res.header('Access-Control-Allow-Origin', '*').
    res.json({
      status: 200,
      success: true,
      msg: "Hello World",
  });
      
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
});


