module.exports = function(error, req, res, next){
    res.status(500).send('Somthing Went Wrong');
}