export { };

const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {

    const token = req.header('token');
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmMwMDZmNzFlYmJhMTM0YzgwYzllODkiLCJmaXJzdE5hbWUiOiJleWVydXMiLCJsYXN0TmFtZSI6Inpld2R1IiwiZW1haWwiOiJleWVydXMxMjNAZ21haWwuY29tIiwidXNlclR5cGUiOiJBZG1pbiIsIndpc2hMaXN0SWQiOm51bGwsImNhcnRJZCI6bnVsbCwiaWF0IjoxNjA2ODIxOTc5fQ.meEkyK50694PAreEh9mnBaFKSLgyqBbhw8H_wX0nxys";
    if(!token) return res.status(401).send('Access Denied.No Token Provided. ');
    try{
        const decodedToken = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decodedToken;
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
