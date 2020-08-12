export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { Conversation } = require('../../src/models/message');

let server;


describe('/messages', () => {

    beforeEach(() => { server = require('../../src/server'); });
    afterEach(async () => {
        await Conversation.deleteMany({});
        server.close();
    });

    describe('GET /:userId', () => {
        it('should return all conversations of user', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();
            const user3Id = mongoose.Types.ObjectId().toHexString();

            const conversations = [
                { user1: user1Id, user2: user2Id, messages: [] },
                { user1: user1Id, user2: user3Id, messages: [] },
            ];

            await Conversation.insertMany(conversations);

            const res = await request(server).get(`/messages/user/${user1Id}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.user1 === user1Id && g.user2 === user2Id)).toBeTruthy();
            expect(res.body.some(g => g.user1 === user1Id && g.user2 === user3Id)).toBeTruthy();

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

        it('should return 404 if no genre with the given id exists', async () => {
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

        it('should return 404 if conversation Id is not a valid Id', async () => {

            const res = await request(server)
                .put(`/messages/${mongoose.Types.ObjectId().toHexString()}/1/${mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(404);
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

        it('should return 404 if conversation Id is not a valid Id', async () => {

            const res = await request(server)
                .delete(`/messages/${mongoose.Types.ObjectId().toHexString()}/1`);

            expect(res.status).toBe(404);
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