//const Report = require('../models/Report');
export{};
const express = require('express');
const router = express.Router();
// const {filterUsers, populateRegions, populateSubscripions, filterOrders, addMoneyTransfered, filterDisputes} = require('../models/report');
// const {Customer, Seller, Buyer, Both} = require('../models/customer');
// const Order = require('../models/order');
// const Region = require('../models/region');
// const Payment = require('../models/payment');
// const Subscriptions = require('../models/subscription');
// const Dispute = require('../models/Dispute');
// const Rating = require('../models/rating');

//get admin report

router.get('/', async(req, res)=>{
 res.send('report routes');
});
// router.get('/admin/:startDate/:endDate', async(req, res) => {

//     try{
//         const report = {
//             numOfUsers: Customer.find().length,
//             numOfOrders: Order.find().length,
//             amountOfMoneyTransfered: addAmount(Payment.find()),
//             userRegion: Region.find().sort({name: 1}).select({name: 1}),
//             startDate: req.params.startDate,
//             endDate:  req.params.endDate
//         }
//         res.json({
//             status: 200,
//             success: true,
//             msg: "Admin report successfully provided",
//             report: report
//         });
//     }catch(error){
//         res.json({
//             status: 500,
//             success: false,
//             msg: "Admin report not failed",
//             error: error
//         })
//     }
// });


// router.get('/admin/:startDate/:endDate', async(req, res)=>{
//     const startDate = req.params.startDate;
//     const endDate = req.params.endDate;

//     const users = Customer.find();
//     //const newlyRegistred = registred(users, req.params.startDate, req.params.endDate);
//     const regions = Region.find();
//     const subscriptions = Subscriptions.find();
//     const orders = Order.find();
//     const disputes = Dispute.find();
//     const payments = Payment.find();

//     const Users = filterUsers(users, startDate, endDate);

//     const report = {
//         totalUsers: users.length,
//         Buyers: Users.Buyers,
//         Sellers: Users.Sellers,
//         Both:  Users.Both,
//         verfiedUsers: Users.verfied,
//         newelyRegistredUsers: Users.newlyRegistred,
//         region: populateRegions(regions, users),
//         subscription: populateSubscripions(subscriptions, users),
//         Order: filterOrders(orders),
//         disputes: filterDisputes(disputes),
//         moneyTransfered: addMoneyTransfered(payments),
//     }
//     res.send(report);
// });

// router.get('/user/:id/:startDate/:endDate', async(req, res) => {
//     //find seller
//     const seller = Seller.findById(req.params.id);
//     if(!seller) res.status(404).send('No user found with this id');
//     try{
//         const report = {
//             orders: filterOrders(seller.orderIds),
//             products: seller.products,
//             subscription: seller.subscription,
//             rating: Rating.find({userId: req.params.id}).select({ratingValue: 1}),
//             subscribers: seller.subscribers.length
//         }
//         res.json({
//             status: 200,
//             success: true,
//             msg: 'report successfully provided',
//             report: report
//         });
//     }catch(error){
//         res.json({
//             status: 500,
//             success: false,
//             msg: 'report failed',
//             error: error.msg
//         });
//     }
   
// });

// //get user report
// router.get('/:id', async(req, res)=>{
//     res.send('user Report');
// });

module.exports = router;