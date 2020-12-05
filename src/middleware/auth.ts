export { };

const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
    
    const token = req.header('token');
    //console.log(token);
    //admin
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmMwMDZmNzFlYmJhMTM0YzgwYzllODkiLCJmaXJzdE5hbWUiOiJleWVydXMiLCJsYXN0TmFtZSI6Inpld2R1IiwiZW1haWwiOiJleWVydXMxMjNAZ21haWwuY29tIiwidXNlclR5cGUiOiJBZG1pbiIsIndpc2hMaXN0SWQiOm51bGwsImNhcnRJZCI6bnVsbCwiaWF0IjoxNjA3MTEzMzA1fQ.PBRLUd127UyzEHpxoLuVsB9-Xca-dH5V6ZmtnYm7Yl8";
    //buyer
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNhOWM2NjA4MWI1NzA1ZjA2OTkxNzUiLCJmaXJzdE5hbWUiOiJidXllciIsImxhc3ROYW1lIjoiYnV5ZXIiLCJlbWFpbCI6ImJ1eWVyQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoiQnV5ZXIiLCJ3aXNoTGlzdElkIjpudWxsLCJjYXJ0SWQiOm51bGwsImlhdCI6MTYwNzExNDA4OX0.7Xk3pjEmqV7p-5X5LzwzJdHuAWU7hnODucFp_812c8c";
    //Seller
    //const seller = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNhOWNhYzA4MWI1NzA1ZjA2OTkxNzYiLCJmaXJzdE5hbWUiOiJzZWxsZXIiLCJsYXN0TmFtZSI6InNlbGxlciIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoiU2VsbGVyIiwid2lzaExpc3RJZCI6bnVsbCwiY2FydElkIjpudWxsLCJpYXQiOjE2MDcxMTQxMjh9._1kjdmQamDKr-XQMktnw3QCRcZhbboQnnlculHqUHSA";
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
