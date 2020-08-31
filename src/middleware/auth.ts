const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next){
    const token = req.header('token');
    if(!token) return res.status(401).send('Access Denied.No Token Provided. ');
    try{
        const decodedToken = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decodedToken;
        next();
    }catch(ex){
        res.status(400).send('Invalid Token');
    }
}