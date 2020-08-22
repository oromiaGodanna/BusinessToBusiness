export {};
const {Dispute, validateDispute} = require('../models/dispute');
const express = require('express');
const router = express.Router();

router.post('/openDispute', async (req, res) => {

    //validate the request 
    const { error } = validateDispute(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let dispute = new Dispute({ 
        orderId: req.body.orderId,
        reason: req.body.reason,
        refundAmount: req.body.refundAmount,
        description: req.body.description,
        evidence: req.body.evidence,
        disputeStatus: req.body.disputeStatus,
        disputeSettlement: req.body.disputeSettlement
        
    });
    console.log(req.body.disputeSettlement)
    try {
        dispute = await dispute.save();
        res.send(dispute);
    } catch (err) {
        console.log(err.message)
    }
    

});

module.exports = router;