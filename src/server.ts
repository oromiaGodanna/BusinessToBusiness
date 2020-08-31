import * as express from "express";
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const config = require('config');
require('dotenv').config();
const error = require('./middleware/error');
const customer = require('./routes/customer');
const user = require('./routes/user');

const subscription = require('./routes/subscription');

if(!process.env.jwtPrivateKey){
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/b2b', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected to mongoDB...')})
  .catch( err => console.error('Could not connect to mongoDB....'));


app.use(bodyParser.json());
//middlerwares
app.use('/customer', customer);
app.use('/user', user);

app.use(error);
app.use(bodyParser.json());
app.use('/subscription', subscription);


app.get("/", (req, res) => {
    res.send("Hello World!!!")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
});


