export {};
const {Dispute, validateDispute, validateSettlement} = require('../models/dispute');
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
    try {
        dispute = await dispute.save();
        res.send(dispute);
    } catch (err) {
        console.log(err.message)
    }
    

});

router.get('/getDispute/:id', async (req, res) => {
   
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).send('No Dispute for the given user.');

    res.send(dispute);


});
//get disputes using buyer ID
router.get('/getDisputes/', async (req, res) =>{
    // get dispute for the given order ids
    const disputes = await Dispute.find({
        'orderId': { $in : req.body.orderIds}
    }, function(err, docs){ 
        if(err)
        console.log(err);
        
    });

    if (!disputes) return res.status(404).send('No Order for the given product.');

    res.send({disputes});
})

router.put('/cancelDispute/:id', async (req, res) => {
    //find order for the given id and update status
    const dispute = await Dispute.findByIdAndUpdate(req.params.id, 
        {disputeStatus: "canceled"}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!dispute) return res.status(404).send('No dispute for the given order.');

    res.send(dispute);
});

router.put('/closeDispute/:id', async (req, res) => {
    //validate the settlement object
    const {error} = validateSettlement(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    //find order for the given id and update status
    const dispute = await Dispute.findByIdAndUpdate(req.params.id, 
        {"$set":  {disputeStatus: "setteled", disputeSettlement:req.body}}, 
        {new: true}, function(err, docs){
            if(err){
                console.log(err);
            }
        });
    if (!dispute) return res.status(404).send('No dispute for the given order.');

    res.send(dispute);
});

module.exports = router;