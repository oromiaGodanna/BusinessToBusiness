export { };


require('dotenv').config();
const express = require('express');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
// Joi = Joi.extend(require('joi-phone-number'));
const Fawn = require('fawn');
const error = require('./middleware/error');
const { authSocket } = require('./middleware/auth');
require('express-async-errors');
const winston = require('winston');
// require('winston-mongodb');
const config = require('config');



const socket = require('socket.io');


const { message, unreadCount, sendMessage, joinConversations } = require('./routes/message');
// const message = require('./routes/message');
const promotion = require('./routes/promotion');
const { notification } = require('./routes/notification');
const customer = require('./routes/customer');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const user = require('./routes/user');
const subscription = require('./routes/subscription');
const task = require('./routes/task');
const report = require('./routes/report');
const country = require('./routes/country');

// jerry's
const productRoutes = require('./routes/product');
const wishListRoutes = require('./routes/wishList');
const cartRoutes = require('./routes/cart');
const specialofferRoutes = require('./routes/specialOffer');
const proformaRoutes = require('./routes/proforma');
const categoryRoutes = require('./routes/category');
const measurementRoutes = require('./routes/Measurement');
//

/*if(!process.env.jwtPrivateKey){
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}*/

// sockets
const MessageSocket = require('./realtime/messageSocket');
const NotificationSocket = require('./realtime/notificationSocket');


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
  res.append('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.append("Access-Control-Allow-Headers", "x-auth-token, Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.append('Access-Control-Allow-Credentials', true);
  next();
});



mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => { console.log(`Connected to mongoDB: ${config.get('db')}...`) })
  .catch(err => console.error('Could not connect to mongoDB....', err));


Fawn.init(mongoose);

app.get('/', (req, res) => {
  res.send('business to business ecommerce');
});

app.use(express.json());
app.use('/messages', message);
app.use('/promotions', promotion);
app.use('/notifications', notification);

// app.use('/customers', customer);
app.use('/auth', auth);

// mercy's
app.use('/customer', customer);
app.use('/user', user);
app.use('/subscription', subscription);
app.use('/tasks', task);
app.use('/report', report);
app.use('/countries', country);

// jerry's
app.use('/product',productRoutes);
app.use('/wishlist',wishListRoutes);
app.use('/cart',cartRoutes);
app.use('/specialOffer',specialofferRoutes);
app.use('/proforma',proformaRoutes);
app.use('/category',categoryRoutes);
app.use('/measurement',measurementRoutes);
//

app.use(error);


const server = app.listen(port, () => {
  return console.log(`server is listening on ${port}...`);
});




const io = socket(server);


io
  .use(authSocket)
  .on('connection', async (socket) => {


    socket.emit('im connected');
    // let count = await unreadCount(socket);
    // console.log(count);
    // socket.emit('unreadCount', count);

    // join conversations of user
    await joinConversations(socket);

    // User has to also join promotion, order and performa

    // socket joins a room identified by user id
    socket.join(socket.user._id);



    // Create event handlers for this socket
    var eventHandlers = {
      message: new MessageSocket(io, socket),
      notification: new NotificationSocket(io, socket),
    };

    // Bind events to handlers
    for (var category in eventHandlers) {
      var handler = eventHandlers[category].handler;
      for (var event in handler) {
        socket.on(event, handler[event]);
      }
    }


  });




module.exports = server;
