//const Report = require('../models/Report');
const express = require('express');
const router = express.Router();

//get admin report

router.get('/admin', async(req, res)=>{
    res.send('Admin Report');
});

//get user report
router.get('/:id', async(req, res)=>{
    res.send('user Report');
});

module.exports = router;