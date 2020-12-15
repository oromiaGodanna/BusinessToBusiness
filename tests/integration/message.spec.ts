import { response } from "express";

export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { Conversation } = require('../../src/models/message');
const { User } = require('../../src/models/user');
const { Customer } = require('../../src/models/customer');

let server = require('../../src/server');;
let token;
let loggedInUserId;
let users: any = [
    {
        // _id: mongoose.Types.ObjectId().toHexString(),
        email: 'user1.test@gmail.com',
        password: 'user1.Test',
        firstName: 'user1',
        lastName: 'test',
        userType: 'Both',
        mobile: '0912345678',
        companyName: 'user1 company',
        tinNumber: '1234567891',

    },
    {
        // _id: mongoose.Types.ObjectId().toHexString(),
        email: 'user2.test@gmail.com',
        password: 'user2.Test',
        firstName: 'user2',
        lastName: 'test',
        userType: 'Both',
        mobile: '0912345678',
        companyName: 'user2 company',
        tinNumber: '1234567891',

    },
    {
        // _id: mongoose.Types.ObjectId().toHexString(),
        email: 'user3.test@gmail.com',
        password: 'user3.Test',
        firstName: 'user3',
        lastName: 'test',
        userType: 'Both',
        mobile: '0912345678',
        companyName: 'user3 company',
        tinNumber: '1234567891',

    }

];

describe('/messages', () => {

    beforeAll(async (done) => {

        const url = `mongodb://localhost/b2b_tests`;
        await mongoose.connect(url, { useNewUrlParser: true });

        users.forEach(async (user) => {
            await request(server)
                .post('/customer/register')
                .send(user)
                .then((err, response) => {
                    console.log('for register')
                    console.log(JSON.stringify(response));
                    console.log(err.text)
                })
        })

        // let customers = await Customer.insertMany(users);
        // console.log(customers);
        let customers = await Customer.find({});
        console.log(customers);
        users = customers;

        await Customer.findOneAndUpdate({ email: 'user1.test@gmail.com' }, { verified: true });


        request(server)
            .post('/customer/login')
            .send({
                email: 'user1.test@gmail.com',
                password: 'user1.Test',
            })
            .end((err, response) => {
                token = response.body.token;
                // loggedInUserId = response.body.user._id;
                console.log(JSON.stringify(response));
                // console.log(response.status);
                // console.log(response.body);
                // console.log(`token: ${token}`);
                done();
            })

    });


    afterEach(async () => {
        await Conversation.deleteMany({});
        await Customer.deleteMany({});
    });

    afterAll(() => {
        server.close();
    })

    describe('GET /:userId', () => {
        it('should return all conversations of user', async () => {

            const user1Id = loggedInUserId;
            const user2Id = users[1]._id;
            const user3Id = users[2]._id;

            const conversations = [
                { users: [user1Id, user2Id], messages: [] },
                { users: [user1Id, user3Id], messages: [] },

            ];

            await Conversation.insertMany(conversations);

            const res = await request(server).get(`/messages`).set('token', token);

            console.log(res.body[0].users);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => { console.log(g.users); g.users.includes(user1Id) && g.users.includes(user2Id) })).toBeTruthy();
            expect(res.body.some(g => { console.log(g.users); g.users.includes(user1Id) && g.users.includes(user3Id) })).toBeTruthy();
            // expect(res.body.some(g => g.users.includes(user1Id) && g.users.includes(user3Id))).toBeTruthy();
            // expect(res.body[0].users).toEqual(expect.arrayContaining([user1Id, user2Id]));
            // expect(res.body[1].users).toEqual(expect.arrayContaining([user1Id, user3Id]));
            // expect(res.body.some(g => g.users.toEqual(expect.arrayContaining([user1Id, user3Id]))));
            // expect(res.body.some(g => g.users === [user1Id, user3Id])).toBeTruthy();
            // expect(res.body.some(g => g.user1 === user1Id && g.user2 === user2Id)).toBeTruthy();
            // expect(res.body.some(g => g.user1 === user1Id && g.user2 === user3Id)).toBeTruthy();

        });
    });


    describe('GET /:convId', () => {

        it('should return a conversation if valid id is passed', async () => {
            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();

            const conversation = new Conversation({ user1: user1Id, user2: user2Id, messages: [] });
            await conversation.save();

            const res = await request(server).get(`/messages/${conversation._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user1', user1Id);
            expect(res.body).toHaveProperty('user2', user2Id);
            expect(res.body.messages.length).toBeLessThanOrEqual(10);
        });

        it('should return 404 if invalid conversation id is passed', async () => {

            const res = await request(server).get(`/messages/1`);

            expect(res.status).toBe(404);
        });

        it('should return 404 if no conversation with the given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/messages/' + id);

            expect(res.status).toBe(404);
        });
    });


    describe('POST /', () => {


        it('should return 400 if user1 is not a valid Id', async () => {

            const res = await request(server)
                .post('/messages')
                .send({ user1: '1' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if user2 is not a valid Id', async () => {

            const res = await request(server)
                .post('/messages')
                .send({ user2: '1' });

            expect(res.status).toBe(400);
        });


        it('should save and return the conversation if it is valid', async () => {
            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server)
                .post('/messages')
                .send({ user1: user1Id, user2: user2Id, messages: [] });

            const conv = await Conversation.find({ user1: user1Id });

            expect(conv).not.toBeNull();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('user1', user1Id);
            expect(res.body).toHaveProperty('user2', user2Id);
        });


    });


    describe('PUT /:convId', () => {


        it('should return 400 if sender is not a valid Id', async () => {

            const res = await request(server)
                .put(`/messages/${mongoose.Types.ObjectId().toHexString()}`)
                .send({ sender: '1' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if message is empty', async () => {

            const res = await request(server)
                .put(`/messages/${mongoose.Types.ObjectId().toHexString()}`)
                .send({ sender: mongoose.Types.ObjectId().toHexString(), message: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if product is not a valid Id', async () => {

            const res = await request(server)
                .put(`/messages/${mongoose.Types.ObjectId().toHexString()}`)
                .send({ sender: mongoose.Types.ObjectId().toHexString(), message: 'a', product: '1' });

            expect(res.status).toBe(400);
        });

        it('should return 404 if conversation Id is not a valid Id', async () => {

            const res = await request(server)
                .put(`/messages/1`)
                .send({
                    sender: mongoose.Types.ObjectId().toHexString(),
                    message: 'a',
                    product: mongoose.Types.ObjectId().toHexString()
                });

            expect(res.status).toBe(404);
        });

        it('should return 404 if conversation with the given Id does not exist', async () => {

            const res = await request(server)
                .put(`/messages/${mongoose.Types.ObjectId().toHexString()}`)
                .send({
                    sender: mongoose.Types.ObjectId().toHexString(),
                    message: 'a',
                    product: mongoose.Types.ObjectId().toHexString()
                });

            expect(res.status).toBe(404);
        });

        it('should save and return the message to the conversation', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();

            const res1 = await request(server)
                .post('/messages')
                .send({ user1: user1Id, user2: user2Id, messages: [] });

            const res = await request(server)
                .put(`/messages/${res1.body._id}`)
                .send({
                    sender: user1Id,
                    message: 'a',
                    product: mongoose.Types.ObjectId().toHexString()
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.messages.length).toBe(1);
            expect(res.body.messages[0]).toHaveProperty('message', 'a');
        });

    });


    // what if user id and message id is not valid????
    describe('PUT /:userId/:convId/:messageId', () => {

        it('should return 400 if conversation Id is not a valid Id', async () => {

            const res = await request(server)
                .put(`/messages/${mongoose.Types.ObjectId().toHexString()}/1/${mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(400);
        });

        it('should return 404 if conversation with the given Id does not exist', async () => {

            const res = await request(server)
                .put(`/messages/${mongoose.Types.ObjectId().toHexString()}/${mongoose.Types.ObjectId().toHexString()}/${mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(404);
        });

        it('should return 404 if user Id is not a valid Id', async () => {

            const res = await request(server)
                .put(`/messages/1/${mongoose.Types.ObjectId().toHexString()}/${mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(404);
        });

        it('should return 404 if user with the given Id that not exist', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();

            const res1 = await request(server)
                .post('/messages')
                .send({ user1: user1Id, user2: user2Id, messages: [] });

            const res2 = await request(server)
                .put(`/messages/${res1.body._id}`)
                .send({
                    sender: user1Id,
                    message: 'a',
                    product: mongoose.Types.ObjectId().toHexString()
                });

            const res = await request(server)
                .put(`/messages/${mongoose.Types.ObjectId().toHexString()}/${res2.body._id}/${res2.body.messages[0]._id}`);


            expect(res.status).toBe(404);

        });

        it('should delete the message for that specific user', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();

            const res1 = await request(server)
                .post('/messages')
                .send({ user1: user1Id, user2: user2Id, messages: [] });

            const res2 = await request(server)
                .put(`/messages/${res1.body._id}`)
                .send({
                    sender: user1Id,
                    message: 'a',
                    product: mongoose.Types.ObjectId().toHexString()
                });

            const res = await request(server)
                .put(`/messages/${user1Id}/${res2.body._id}/${res2.body.messages[0]._id}`);


            expect(res.status).toBe(200);
            expect(res.body.messages[0].deleted).toHaveProperty('user1', true);
            expect(res.body.messages[0].deleted).toHaveProperty('user2', false);
        });

    });


    describe('DELETE /:userId/:convId', () => {

        it('should return 400 if conversation Id is not a valid Id', async () => {

            const res = await request(server)
                .delete(`/messages/${mongoose.Types.ObjectId().toHexString()}/1`);

            expect(res.status).toBe(400);
        });

        it('should return 404 if conversation with the given Id does not exist', async () => {

            const res = await request(server)
                .delete(`/messages/${mongoose.Types.ObjectId().toHexString()}/${mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(404);
        });

        it('should return 404 if user Id is not a valid Id', async () => {

            const res = await request(server)
                .delete(`/messages/1/${mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(404);
        });

        it('should return 404 if user with the given Id does not exist', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();

            const res1 = await request(server)
                .post('/messages')
                .send({ user1: user1Id, user2: user2Id, messages: [] });

            const res = await request(server)
                .delete(`/messages/${mongoose.Types.ObjectId().toHexString()}/${res1.body._id}`);

            expect(res.status).toBe(404);
        });

        it('should delete the conversation', async () => {
            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();

            const res1 = await request(server)
                .post('/messages')
                .send({ user1: user1Id, user2: user2Id, messages: [] });

            const res = await request(server)
                .delete(`/messages/${user1Id}/${res1.body._id}`);

            expect(res.status).toBe(200);
            expect(res.body.deleted).toHaveProperty('user1', true);
            expect(res.body.deleted).toHaveProperty('user2', false);

        });
    });


});