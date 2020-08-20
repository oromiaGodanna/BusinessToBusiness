export {};
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const rating = require('./routes/rating')

mongoose.connect('mongodb://localhost/b2b', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected to mongoDB...')})
  .catch( err => console.error('Could not connect to mongoDB....'));

app.get("/", (req, res) => {
    res.send("Hello World!!!")
})

app.use(express.json());
app.use('/rating', rating);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
});


