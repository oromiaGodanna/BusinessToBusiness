export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { Measurement } = require('../../src/models/measurement');
const { Admin } = require('../../src/models/user');
const server = require('../../src/server');
//let server;
let user;
let token;
describe(' Measurement ', () => {

    beforeAll(async (done) => {

      //token here

        done();
    })

    beforeEach(() => {

        /*request(server)
        .post(`/customer/login`)
        .send({
            email: "eyerus123@gmail.com",
            password: "Password@123",
        })*/

    });
    afterEach(async () => {
        await Measurement.deleteMany({});
        await Admin.deleteMany({});
        server.close();
    });

    describe('POST /addMeasurement', () => {
       
        it('It should return status 400 if validation has error(to add measurement).', async () => {
            const res = await request(server)
                .post(`/measurement/addMeasurement`)
                //token here .set('token',token)
                .send({
                  measurementName: "",
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 200 and add measurement.', async () => {
            const res = await request(server)
                .post(`/measurement/addMeasurement`)
                //token here .set('token',token)
                .send({
                    measurementName: "pieces",

                })

            expect(res.status).toBe(200);

        })

        describe('POST /editMeasurement/:id', () => {

            it('It should return status 400 if measurement Id is invalid', async () => {
                const res = await request(server)
                    .post(`/measurement/editMeasurement/`+"111")
                    //token here .set('token',token)
                    .send({
                        measurementName: "pieces",
    
                    })
    
                expect(res.status).toBe(400);
    
            })
    
           
            it('It should return status 404 since measurement is not found(to update)', async () => {
                const res = await request(server)
                    .post(`/measurement/editMeasurement/`+"5fc006f71ebba134c80c9e89")
                    //token here .set('token',token)
                    .send({
                        measurementName: "pieces",
                    })
    
                expect(res.status).toBe(404);
    
            })


            it('It should return status 400 if validation has error(to update measurement).', async () => {
               
                const measurement = Measurement({
                    measurementName: "pieces",
    
                })
    
                await measurement.save();
                const measurementId = measurement._id;
                const res = await request(server)
                    .post(`/measurement/editMeasurement/`+measurementId)
                    //token hereeee .set('token',token)
                    .send({
                        measurementName: null,
    
                    })
    
                expect(res.status).toBe(400);
    
            })
    
            
    
            it('It should return status 200 and update measurement', async () => {
    
                const measurement = Measurement({
                    measurementName: "pieces",
    
                })
    
                await measurement.save();
                const measurementId = measurement._id;
                const res = await request(server)
                    .post(`/measurement/editMeasurement/`+measurementId)
                    //token hereeee .set('token',token)
                    .send({
                        measurementName: "pieces",
    
                    })
    
    
                expect(res.status).toBe(200);
    
            })
    
        });
        
    })

    describe('GET /getMeasurements', () => {

        it('should return 200 and return measurements', async () => {
            const res = await request(server).get(`/measurement/getMeasurements`);

            expect(res.status).toBe(200);
        })
    })
        
    describe('GET /getMeasurement/:id', () => {

        it('should return 400 if measurement id is not valid', async () => {
            const res = await request(server).get(`/measurement/getMeasurement/11`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if measurement is not found', async () => {
            const res = await request(server).get(`/measurement/getMeasurement/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);
        })

        it('It should return status 200 and get measurement by id', async () => {
    
            const measurement = Measurement({
                name: "pieces",

            })

            await measurement.save();
            const measurementId = measurement._id;
            const res = await request(server).get(`/measurement/getMeasurement/`+measurementId);

            expect(res.status).toBe(200);

        })

    })

    describe('GET /deleteMeasurement/:id', () => {

        it('should return 400 if measurement id is not valid', async () => {
            const res = await request(server).delete(`/measurement/deleteMeasurement/11`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if measurement is not found', async () => {
            const res = await request(server).delete(`/measurement/deleteMeasurement/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);
        })

        it('It should return status 200 and delete measurement', async () => {
    
            const measurement = Measurement({
                name: "pieces",

            })

            await measurement.save();
            const measurementId = measurement._id;
            const res = await request(server).delete(`/measurement/deleteMeasurement/`+measurementId);

            expect(res.status).toBe(200);

        })

    })

  
});