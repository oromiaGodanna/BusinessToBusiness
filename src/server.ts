import * as express from "express";
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const task = require('./routes/task');

mongoose.connect('mongodb://localhost/b2b', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected to mongoDB...')})
  .catch( err => console.error('Could not connect to mongoDB....'));

  app.use(bodyParser.json());
  app.use('/tasks', task);


app.get("/", (req, res) => {
    res.send("Hello World!!!")
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
});


