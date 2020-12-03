
const request = require('supertest');
const mongoose = require('mongoose');
const { Email, Sms } = require('../../src/models/promotion');

let server;

describe('/promotion', () => {

    beforeEach(() => { server = require('../../src/server'); });
    afterEach(async () => {
        await Email.deleteMany({});
        server.close();
    });


    // describe('POST /promotionEmail', () => {

    //     it('should return 400 if sender is not a valid objectId', async () => {
    //         const user1Id = mongoose.Types.ObjectId().toHexString();

    //         const res = await request(server)
    //             .post('/promotions/promotionEmail')
    //             .send({
    //                 sender: '1',
    //                 recipients: [user1Id],
    //                 to: ['a'],
    //                 username: 'a',
    //                 subject: 'a',
    //                 intro: ['a'],
    //                 instructions: 'a',
    //                 buttonText: 'a',
    //                 buttonLink: 'a'
    //             });

    //         expect(res.status).toBe(400);
    //     })

    //     it('should return 400 if recipients is not an array of objectIds', async () => {
    //         const user1Id = mongoose.Types.ObjectId().toHexString();

    //         const res = await request(server)
    //             .post('/promotions/promotionEmail')
    //             .send({
    //                 sender: user1Id,
    //                 recipients: ['a'],
    //                 to: ['a'],
    //                 username: 'a',
    //                 subject: 'a',
    //                 intro: ['a'],
    //                 instructions: 'a',
    //                 buttonText: 'a',
    //                 buttonLink: 'a'
    //             });

    //         expect(res.status).toBe(400);
    //     })

    //     it('should save and return email', async () => {
    //         // first set api key
    //         const user1Id = mongoose.Types.ObjectId().toHexString();

    //         const res = await request(server)
    //             .post('/promotions/promotionEmail')
    //             .send({
    //                 sender: user1Id,
    //                 recipients: [user1Id],
    //                 to: ['tungat72@gmail.com'],
    //                 username: 'a',
    //                 subject: 'a',
    //                 intro: ['a'],
    //                 instructions: 'a',
    //                 buttonText: 'a',
    //                 buttonLink: 'a'
    //             });

    //         console.log(res.error) 

    //         expect(res.status).toBe(200);
    //         expect(res.body).toHaveProperty('sender', user1Id);
    //     })

    // })

    describe('POST /promotionSms', () => {

        it('should return 400 if sender is not a valid objectId', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server)
                .post('/promotions/promotionSms')
                .send({
                    sender: '1',
                    recipients: [user1Id],
                    to: ['+251923072072'],
                    body: 'a',
                });

            expect(res.status).toBe(400);
        })

        it('should return 400 if recipients is not an array of objectId', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server)
                .post('/promotions/promotionSms')
                .send({
                    sender: user1Id,
                    recipients: ['a'],
                    to: ['+251923072072'],
                    body: 'a',
                });

            expect(res.status).toBe(400);
        })

        // it('should return 400 if to is not a valid phone number', async () => {
        //     const user1Id = mongoose.Types.ObjectId().toHexString();

        //     const res = await request(server)
        //         .post('/promotions/promotionSms')
        //         .send({
        //             sender: user1Id,
        //             recipients: [user1Id],
        //             to: ['+2519230720'],
        //             body: 'a',
        //         });

        //     expect(res.status).toBe(400);
        // })

        it('should save and return sms', async () => {
            // first set api key
            const user1Id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server)
                .post('/promotions/promotionSms')
                .send({
                    sender: user1Id,
                    recipients: [user1Id],
                    to: ['+251923072072'],
                    body: 'a',
                });

            console.log(res.error) 

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('sender', user1Id);
        }, 30000)
    })


})