export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { SysNotification } = require('../../src/models/notification');

let server;

describe('/notifications', () => {

    beforeEach(() => { server = require('../../src/server'); });
    afterEach(async () => {
        await SysNotification.deleteMany({});
        server.close();
    });

    describe('GET /user/:userId', () => {

        it('should return all notifications of user', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();
            const user2Id = mongoose.Types.ObjectId().toHexString();

            const notifications = [
                {
                    notificationType: "performa",
                    recipients: [user1Id, user2Id],
                    title: "some performa",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Performa'
                },
                {
                    notificationType: "order",
                    recipients: [user1Id, user2Id],
                    title: "some order",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Order'
                },
                {
                    notificationType: "promotion",
                    recipients: [user2Id],
                    title: "some promotion",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Promotion'
                }
            ];

            await SysNotification.insertMany(notifications);

            const res = await request(server).get(`/notifications/user/${user1Id}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.recipients.some(r => r === user1Id))).toBeTruthy();
        })

        it('should return 404 if user id is not valid', async () => {
            const res = await request(server).get(`/notifications/user/1`);

            expect(res.status).toBe(404);
        })

    })

    describe('GET /:id', () => {

        it('should return 404 if notification id is not valid', async () => {
            const res = await request(server).get(`/notifications/1`);

            expect(res.status).toBe(404);
        })

        it('should return 404 if notification with this id does not exist', async () => {
            const res = await request(server).get(`/notifications/${mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(404);
        })

        it('should return the notification with the specified id', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();

            const notification = SysNotification({
                notificationType: "performa",
                recipients: [user1Id],
                title: "some performa",
                content: "some content",
                target: mongoose.Types.ObjectId().toHexString(),
                externalModelType: 'Performa'
            });
            await notification.save();

            const res = await request(server).get(`/notifications/${notification._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
        })

    })

    describe('GET /user/:userId/type/:type', () => {

        it('should return 404 if user id is not valid', async () => {
            const res = await request(server).get(`/notifications/user/1/type/order`);

            expect(res.status).toBe(404);
        })

        it('should return 404 if type is not valid', async () => {
            const res = await request(server).get(`/notifications/user/${mongoose.Types.ObjectId().toHexString()}/type/a`);

            expect(res.status).toBe(400);
        })

        it('should return the notification that belongs to the given user and type', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();

            const notifications = [
                {
                    notificationType: "performa",
                    recipients: [user1Id],
                    title: "some performa",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Performa'
                },
                {
                    notificationType: "order",
                    recipients: [user1Id],
                    title: "some order",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Order'
                }
            ];
            await SysNotification.insertMany(notifications);


            const res = await request(server).get(`/notifications/user/${user1Id}/type/performa`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('notificationType', 'performa');
        })

    })

    describe('POST /', () => {

        it('should return 400 if notification type is not valid', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server)
                .post(`/notifications`)
                .send({
                    notificationType: "a",
                    recipients: [user1Id],
                    title: "some order",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Order'
                });

            expect(res.status).toBe(400);
        })

        it('should return 400 if recipients is not an array of valid objectIds', async () => {

            const res = await request(server)
                .post(`/notifications`)
                .send({
                    notificationType: "order",
                    recipients: ['a'],
                    title: "some order",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                });

            expect(res.status).toBe(400);
        })


        it('should return 400 if target is not a valid objectId', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server)
                .post(`/notifications`)
                .send({
                    notificationType: "order",
                    recipients: [user1Id],
                    title: "some order",
                    content: "some content",
                    target: 'a',
                });

            expect(res.status).toBe(400);
        })

        it('should save and return the notification', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server)
                .post(`/notifications`)
                .send({
                    notificationType: "order",
                    recipients: [user1Id],
                    title: "some order",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Order'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
        })

    })

    describe('DELETE /:id', () => {

        it('should return 400 if notification id is not valid', async () => {
            const res = await request(server).delete(`/notifications/1`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if notification with this id does not exist', async () => {
            const res = await request(server).delete(`/notifications/${mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(404);
        })

        it('should delete and return the deleted notification', async () => {
            const user1Id = mongoose.Types.ObjectId().toHexString();

            const notification = SysNotification({
                notificationType: "performa",
                recipients: [user1Id],
                title: "some performa",
                content: "some content",
                target: mongoose.Types.ObjectId().toHexString(),
                externalModelType: 'Performa'
            });
            await notification.save();

            const res = await request(server).delete(`/notifications/${notification._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', notification._id.toHexString());
        })
    })


    describe('DELETE /user/:userId', () => {

        it('should return 400 if user id is not valid', async () => {
            const res = await request(server).delete(`/notifications/user/1`);

            expect(res.status).toBe(400);
        })


        it('should delete the user from the notifications', async () => {
            const user1Id = mongoose.Types.ObjectId().toHexString();

            const notification = SysNotification({
                notificationType: "performa",
                recipients: [user1Id],
                title: "some performa",
                content: "some content",
                target: mongoose.Types.ObjectId().toHexString(),
                externalModelType: 'Performa'
            });
            await notification.save();

            const res = await request(server).delete(`/notifications/user/${user1Id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('n', 1);
            expect(res.body).toHaveProperty('nModified', 1);
            expect(res.body).toHaveProperty('ok', 1);
        })
    })

    describe('DELETE /user/:userId/type/:type', () => {

        it('should return 400 if user id is not valid', async () => {
            const res = await request(server).delete(`/notifications/user/1/type/order`);

            expect(res.status).toBe(400);
        })

        it('should return 400 if type is not valid', async () => {
            const res = await request(server).get(`/notifications/user/${mongoose.Types.ObjectId().toHexString()}/type/a`);

            expect(res.status).toBe(400);
        })

        it('should return the notification that belongs to the given user and type', async () => {

            const user1Id = mongoose.Types.ObjectId().toHexString();

            const notifications = [
                {
                    notificationType: "performa",
                    recipients: [user1Id],
                    title: "some performa",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Performa'
                },
                {
                    notificationType: "order",
                    recipients: [user1Id],
                    title: "some order",
                    content: "some content",
                    target: mongoose.Types.ObjectId().toHexString(),
                    externalModelType: 'Order'
                }
            ];
            await SysNotification.insertMany(notifications);

            const res = await request(server).delete(`/notifications/user/${user1Id}/type/performa`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('n', 1);
            expect(res.body).toHaveProperty('nModified', 1);
            expect(res.body).toHaveProperty('ok', 1);
            ;
        })

    })
})
