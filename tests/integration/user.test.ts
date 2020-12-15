export {}
const request = require('supertest');

const {user} = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
let server = require('../server')

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
             _id: new mongoose.Types.ObjectId().toHexString(), 
             firstName: 'Abebe', 
             lastName: 'Kebede', 
             email: "example@gmail.com", 
             userType: 'Both'
            };
        const token = user.generateAuthToken(payload);
        const decoded = jwt.verify(token,  process.env.jwtPrivateKey);
        expect(decoded).toMatchObject(payload);
    });
});


