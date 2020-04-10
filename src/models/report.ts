const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

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

module.exports.valifateReport = function(report){
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

