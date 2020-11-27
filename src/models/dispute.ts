const mongoose = require('mongoose');
const Joi = require('joi');

mongoose.set('useFindAndModify', false);

class DisputeSettlementInfo{
    amount: number
}
let disputeSettlementInfo : DisputeSettlementInfo = {
    amount: 0
}
const disputeStat = ['open', 'canceled', 'setteled'];


const Dispute = mongoose.model('Dispute', new mongoose.Schema({
    
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    refundAmount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    evidence: {
        type: [mongoose.Schema.Types.Mixed],
        required: true,
    },
    disputeStatus:{
        type: String,
        required: true,
        enum: disputeStat,
        default: 'open' 
    },
    disputeSettlement:{
        type: disputeSettlementInfo,
        required: true,
        default: {}
    }
}, { minimize: false }))

function validateDispute(dispute){
    const schema = Joi.object({
        orderId: Joi.objectId().required(),
        reason: Joi.string().required(),
        refundAmount: Joi.number().precision(2).min(1).strict().required(),
        description: Joi.string().required(),
        evidence: Joi.any().required(),
        disputeStatus: Joi.string().valid(...disputeStat).required(),
        disputeSettlement: Joi.object().keys({
            amount: Joi.number().precision(2).min(0).strict()
        }).allow(null).required()
    });

    return schema.validate(dispute);
}
function validateSettlement(settlement){
    const schema = Joi.object().keys({
        amount: Joi.number().precision(2).min(0).strict()
    }).allow(null).required();
    return schema.validate(settlement);
}

exports.Dispute = Dispute;
exports.validateDispute = validateDispute;
exports.validateSettlement = validateSettlement;