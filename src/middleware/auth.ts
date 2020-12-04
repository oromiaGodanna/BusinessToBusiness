export { };

const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {

    const token = req.header('token');
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmMwMDZmNzFlYmJhMTM0YzgwYzllODkiLCJmaXJzdE5hbWUiOiJleWVydXMiLCJsYXN0TmFtZSI6Inpld2R1IiwiZW1haWwiOiJleWVydXMxMjNAZ21haWwuY29tIiwidXNlclR5cGUiOiJCdXllciIsIndpc2hMaXN0SWQiOm51bGwsImNhcnRJZCI6bnVsbCwiaWF0IjoxNjA2OTc1NzEwfQ.ARR3T47RoTNn1HFgqIIMT40tYyOdpEVY5pCgxOtN1vw";
    if(!token) return res.status(401).send('Access Denied.No Token Provided. ');
    try{
        const decodedToken = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decodedToken;
        /*req.user = {
            _id:"5fc006f71ebba134c80c9e89",
            userType:"Admin"
        };*/
        next();
    }catch(ex){
        res.status(400).send('Invalid Token');
    }
}


function authSocket(socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.jwtPrivateKey, function (err, decoded) {
            if (err) { 
                console.log(err);
                return next(new Error('Authentication error'));
             }
            socket.user = decoded;
            next();
        });
    }
    else {
        console.log('no query in socket');
        next(new Error('Authentication error'));
    }
}

module.exports = {
    auth: auth,
    authSocket: authSocket
};
