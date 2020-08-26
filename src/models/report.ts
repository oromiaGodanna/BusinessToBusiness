import { DH_NOT_SUITABLE_GENERATOR } from "constants";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const ObjectId = Schema.Types.ObjectId;

const reportSchema = new Schema({
    numOfUsers: {
        type: Number
    },
    numOfOrders: {
        type: Number
    },
    amountOfMoneyTransfered: {
        type: Number
    },
    userRegion: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;

module.exports.valifateReport = function (report) {
    const schema = {
        numOfUsers: Joi.number().integer(),
        numOfOrders: Joi.number().integer(),
        amountOfMoneyTransfered: Joi.number().precision(2),
        userRegion: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date()
    };
    return Joi.validate(report, schema);
}

const adminReportSchema = new Schema({
    totalUsers: Number,
    Buyers: Number,
    Sellers: Number,
    Both: Number,
    verfiedUsers: Number,
    newelyRegistredUsers: Number,
    usersRegion: [{
        region: String,
        number: Number
    }],
    usersSubscription: [{
        type: String,
        number: Number
    }],
    orders: {
        declined: Number,
        canceled: Number,
        inShipment: Number,
        deliverd: Number,
        //inProgress: Number,
        completed: Number,
    },
    disputes: {
        total: Number,
        closed: Number,
        open: Number,
    },
    moneyTransfered: Float32Array,
});
const sellerReportSchema = new Schema({
    //orders: [ObjectId],
    orders: {
        declined: Number,
        canceled: Number,
        inShipment: Number,
        deliverd: Number,
        //inProgress: Number,
        completed: Number,
    },
    products: [ObjectId],
    subscription: ObjectId,
    rating: Number,
    subscribers: Number
});

module.exports.filterUsers= function (users,startDate, endDate) {
    let Users= {
        Buyers: (users.filter(user => user.userType == 'Buyer')).length,
        Sellers: (users.filter(user => user.userType == 'Seller')).length,
        Both:   (users.filter(user => user.userType == 'Both')).length,
        verfied : (users.filter(user => user.verfied == true)).length,
        newelyRegistred: users.filter(user => user.registredDate >= startDate && user.registredDate <= endDate),
       
    }
    return Users;
}

module.exports.populateRegions = function (regions, users) {
    let userRegions = [];
    regions.forEach(region => {
        const r = {
            region: region.name,
            number: users.filter(user => user.region == region.id),
        }
        userRegions.push(r);
    });
    return userRegions;
}

module.exports.populateSubscripions = function (subscriptions, users) {
    let userSubscription = [];
    subscriptions.forEach(subscription => {
        const s = {
            subscription: subscriptions.name,
            number: users.filter(user => user.subscription == subscription.id),
        }
        userSubscription.push(s);
    });
    return userSubscription;
}

module.exports.filterOrders = function (orders) {
    let userOrders = {
        declined: orders.filter(order => order.filter == 'declined').length,
        canceled: orders.filter(order => order.status == 'canceled').length,
        shipment: orders.filter(order => order.staus == 'shipment').length,
        delivered: orders.filter(order => order.status == 'deliverd').length,
        completed: orders.filter(order => order.status == 'completed').length,
       
    }
    return userOrders;
}

module.exports.filterDisputes = function (disputes) {
    let userDisputes = {
        total: disputes.length,
        closed: disputes.filter(dispute => dispute.filter == 'close').length,
        open: disputes.filter(dispute => dispute.status == 'open').length,
    }
    return userDisputes;
}

module.exports.addMoneyTransfered = function(payments) {
    let amount = 0.0;
    payments.forEach(payment => {
        amount += amount + payment.amountPaid;
        return amount;
    });
}

