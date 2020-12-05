export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { Proforma } = require('../../src/models/proforma');
const server = require('../../src/server');
//let server;
let user;
let token;
describe(' Proforma ', () => {

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
        await Proforma.deleteMany({});
        server.close();
    });

    describe('POST /createProforma', () => {

        it('It should return status 400 if validation has error(to add proforma).', async () => {
            const res = await request(server)
                .post(`/proforma/createProforma`)
                //token here .set('token',token)
                .send({
                    description: "jeans",
                })

            expect(res.status).toBe(400);

        })
        

        it('It should return status 400 if validation has error(to add proforma).', async () => {
            const res = await request(server)
                .post(`/proforma/createProforma`)
                //token here .set('token',token)
                .send({
                    items:[{
                        category: 1111,
                        subCategory: "jeans",
                        description: "jeans",
                        quantity:10,
                       } ]
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 200 and proforma.', async () => {
            const res = await request(server)
                .post(`/proforma/createProforma`)
                //token here .set('token',token)
                .send({

                   items:[{
                    category:"clothes",
                    subCategory: "jeans",
                    description: "jeans",
                    quantity:10,
                   } ]

                })

            expect(res.status).toBe(200);

        })

    });

    describe('POST /requestProforma/:proformaId', () => {

        it('It should return status 400 if proformaId is not valid(request proforma)', async () => {
            const res = await request(server)
                .post(`/proforma/requestProforma/111`);

            expect(res.status).toBe(400);

        })
    })

    describe('GET /getProforma/:proformaId', () => {

        it('It should return status 400 if proformaId is not valid(get proforma)', async () => {
            const res = await request(server).get(`/proforma/getProforma/11`);

            expect(res.status).toBe(400);
        })

        it('should return status 404 and if proforma not found', async () => {
           
            const res = await request(server).get(`/proforma/getProforma/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);
        })


        it('should return status 200 and proforma', async () => {
           
            const proforma = Proforma({
                        userId:"5fc006f71ebba134c80c9e89",
                        items:[{
                            proformaId:"5fc006f71ebba134c80c9e89",
                            category:"clothes",
                            subCategory: "jeans",
                            description: "jeans",
                            quantity:10,
                        } ],
                        status:true

                })
                await proforma.save();
                const proformaId = proforma._id;

            const res = await request(server).get(`/proforma/getProforma/`+proformaId);
            expect(res.status).toBe(200);
        })


    }) 

    describe('GET /getMyProformas', () => {

        it('It should return status 200 and proformas the user added', async () => {
            const res = await request(server).get(`/proforma/getMyProformas`);

            expect(res.status).toBe(200);
        })

    })

    describe('GET /pendingProforma', () => {

        it('It should return status 200 and pending proformas the user added', async () => {
            const res = await request(server).get(`/proforma/pendingProforma`);

            expect(res.status).toBe(200);
        })

    })

    describe('GET /activeProforma', () => {

        it('It should return status 200 and active proformas the user added', async () => {
            const res = await request(server).get(`/proforma/activeProforma`);

            expect(res.status).toBe(200);
        })

    })

    describe('GET /closedProforma', () => {

        it('It should return status 200 and closed proformas the user added', async () => {
            const res = await request(server).get(`/proforma/closedProforma`);

            expect(res.status).toBe(200);
        })

    })


    describe('GET /closeProforma/:proformaId', () => {

        it('It should return status 400 if proformaId is not valid(to close proforma)', async () => {
            const res = await request(server)
                .get(`/proforma/closeProforma/111`);

            expect(res.status).toBe(400);

        })

        it('It should return status 404 if proforma is not found(to close proforma)', async () => {
            const res = await request(server)
                .get(`/proforma/closeProforma/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);

        })

        it('It should return status 200 and proforma is closed', async () => {

            const proforma = Proforma({
                userId:"5fc006f71ebba134c80c9e89",
                items:[{
                    proformaId:"5fc006f71ebba134c80c9e89",
                    category:"clothes",
                    subCategory: "jeans",
                    description: "jeans",
                    quantity:10,
                } ],
                status:true

                })
                await proforma.save();
                const proformaId = proforma._id;
        
            const res = await request(server).get(`/proforma/closeProforma/`+proformaId);

            expect(res.status).toBe(200);

        })


    })


    describe('DELETE /deleteProforma/:proformaId', () => {

        it('It should return status 400 if proformaId is not valid(to delete proforma)', async () => {
            const res = await request(server)
                .delete(`/proforma/deleteProforma/111`);

            expect(res.status).toBe(400);

        })

        it('It should return status 404 if proforma is not found(to delete proforma)', async () => {
            const res = await request(server)
                .delete(`/proforma/deleteProforma/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);

        })

        it('It should return status 200 and proforma is deleted', async () => {

            const proforma = Proforma({
                userId:"5fc006f71ebba134c80c9e89",
                items:[{
                    proformaId:"5fc006f71ebba134c80c9e89",
                    category:"clothes",
                    subCategory: "jeans",
                    description: "jeans",
                    quantity:10,
                } ],
                status:true

                })
                await proforma.save();
                const proformaId = proforma._id;
        
            const res = await request(server).delete(`/proforma/deleteProforma/`+proformaId);

            expect(res.status).toBe(200);

        })


    })


    describe('POST /sendResponse', () => {

        it('It should return status 400 if validation has error is(to send response to proforma)', async () => {
            const res = await request(server)
                .post(`/proforma/sendResponse`)
                .send({
                      itemId:"1111",
                      unitPrice:"200"  
                });

            expect(res.status).toBe(400);

        })

        it('It should return status 400 if validation has error is(to send response to proforma)', async () => {
            const res = await request(server)
                .post(`/proforma/sendResponse`)
                .send({
                      itemId:"5fc006f71ebba134c80c9e89",
                      unitPrice:"unit"  
                });

            expect(res.status).toBe(400);

        })
        it('It should return status 400 if validation has error is(to send response to proforma)', async () => {
            const res = await request(server)
                .post(`/proforma/sendResponse`)
                .send({
                      itemId:"5fc006f71ebba134c80c9e89",
                     
                });

            expect(res.status).toBe(400);

        })

        it('It should return status 404 if item in proforma not found (to send response to proforma)', async () => {
            const res = await request(server)
                .post(`/proforma/sendResponse`)
                .send({
                      itemId:"5fc006f71ebba134c80c9e89",
                      unitPrice:200  
                });

            expect(res.status).toBe(404);

        })

        
       it('It should return status 200 and send response to proforma', async () => {

            const proforma = Proforma({
                userId:"5fc006f71ebba134c80c9e89",
                items:[{
                    proformaId:"5fc006f71ebba134c80c9e89",
                    category:"clothes",
                    subCategory: "jeans",
                    description: "jeans",
                    quantity:10,
                } ],
                status:true

                })
                await proforma.save();
                const proformaId = proforma._id;
                const itemId = proforma.items[0]._id;


             const res = await request(server)
                .post(`/proforma/sendResponse`)
                .send({
                      itemId:itemId,
                      unitPrice:200  
                });


            expect(res.status).toBe(200);

        })


    })


    describe('GET /getResponses/:itemId', () => {

        it('It should return status 400 if itemId is not valid(to get responses)', async () => {
            const res = await request(server).get(`/proforma/getResponses/1`);
               

            expect(res.status).toBe(400);

        })

        it('It should return status 404 if itemId is not found(to get responses)', async () => {
            const res = await request(server).get(`/proforma/getResponses/5fc006f71ebba134c80c9e89`);
               

            expect(res.status).toBe(404);

        })
     
        
       it('It should return status 200 and get responses of the proforma', async () => {

            const proforma = Proforma({
                userId:"5fc006f71ebba134c80c9e89",
                items:[{
                    _id:"5fc006f71ebba134c80c9e89",
                    proformaId:"5fc006f71ebba134c80c9e89",
                    category:"clothes",
                    subCategory: "jeans",
                    description: "jeans",
                    quantity:10,
            
                } ],
                status:true,
                response:[{
                    itemId:"5fc006f71ebba134c80c9e89",
                    unitPrice:200,
                    respondBy:"eyerus zewdu",
                    userId:"5fc006f71ebba134c80c9e89",
                }]
                })
                await proforma.save();
                const proformaId = "5fc006f71ebba134c80c9e89";
                const itemId = proforma.items[0]._id;

            const res = await request(server).get(`/proforma/getResponses/5fc006f71ebba134c80c9e89`);
            

            expect(res.status).toBe(200);

        })


    })




});