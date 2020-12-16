export{};
const {generateAuthToken} = require('../../src/models/user');
const mongoose = require('mongoose');
const request = require('supertest');

let server;

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../src/server') })
    afterEach(async () => { server.close();});
 
    let token;

    const exec = async() => {
        return await request(server).get('/customer/me')
        .set('token', token)
    }
    
    beforeEach(() => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(), 
            firstName: 'Abebe', 
            lastName: 'Kebede', 
            email: "example@gmail.com", 
            userType: 'Both'
        };
        token = generateAuthToken(payload);
    })

    it('should return 401 if no token is provided',  async() => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async() => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async() => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});