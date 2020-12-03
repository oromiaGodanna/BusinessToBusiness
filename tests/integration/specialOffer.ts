export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { Product } = require('../../src/models/product');
const { SpecialOffer } = require('../../src/models/specialOffer');
const server = require('../../src/server');
//let server;
let user;
let token;
describe(' Special Offer ', () => {

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
        await Product.deleteMany({});
        await SpecialOffer.deleteMany({});
        server.close();
    });

    describe('POST /createSpecialOffer', () => {
       
        it('It should return status 400 if validation has error(to add special offer).', async () => {
            const res = await request(server)
                .post(`/specialOffer/createSpecialOffer`)
                //token here .set('token',token)
                .send({
                    productId:"5fc006f71ebba134c80c9e89",
                    title: "jeans",
                    discount: "Cloth",
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 if product id is not valid(to add special offer).', async () => {
            const res = await request(server)
                .post(`/specialOffer/createSpecialOffer`)
                //token here .set('token',token)
                .send({
                    productId:"11",
                    title: "jeans",
                    discount: "Cloth",
                })

            expect(res.status).toBe(400);

        })


        it('It should return status 404 if product not found (to add special offer).', async () => {
            const res = await request(server)
                .post(`/specialOffer/createSpecialOffer`)
                //token here .set('token',token)
                .send({
                    productId:"5fc006f71ebba134c80c9e89",
                    title: "jeans",
                    discount: 100,
                })

            expect(res.status).toBe(404);

        })


        it('It should return status 200 and add special offer.', async () => {

            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
                productName: "jeans",
                productCategory: "Cloth",
                productSubCategory: "Trouser",
                description: "It Is Brand New Jeans",
                minOrder: 10,
                price: 100,
                keyword: ["keyword"],
                measurement: "Piece",
                images: ["Image.jpg"],

            })

            await product.save();

            const productId = product._id;

            const res = await request(server)
                .post(`/specialOffer/createSpecialOffer`)
                //token here .set('token',token)
                .send({
                    productId:productId,
                    title: "jeans",
                    discount: 100,
                })

            expect(res.status).toBe(200);

        })
    })

    describe('POST /openSpecialOffer/:specialOfferId', () => {
       
        it('should return 400 if specialOfferId is not valid(to open special offer)', async () => {
            const res = await request(server).post(`/specialOffer/openSpecialOffer/11`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if product is not found(to open special offer)', async () => {
            const res = await request(server)
                .post(`/specialOffer/openSpecialOffer/5fc006f71ebba134c80c9e89`)
                .send({
                    productId:"5fc006f71ebba134c80c9e89",
                    title: "jeans",
                    discount: 100,
                })
            expect(res.status).toBe(404);
        })


        it('should return 404 if special offer is not found(to open special offer)', async () => {

            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
                productName: "jeans",
                productCategory: "Cloth",
                productSubCategory: "Trouser",
                description: "It Is Brand New Jeans",
                minOrder: 10,
                price: 100,
                keyword: ["keyword"],
                measurement: "Piece",
                images: ["Image.jpg"],

            })

            await product.save();

            const productId = product._id;

            const res = await request(server)
                .post(`/specialOffer/openSpecialOffer/5fc006f71ebba134c80c9e89`)
                .send({
                    productId:productId,
                })
            expect(res.status).toBe(404);
        })

        
        it('should return 200 and special offer is opened', async () => {

            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
                productName: "jeans",
                productCategory: "Cloth",
                productSubCategory: "Trouser",
                description: "It Is Brand New Jeans",
                minOrder: 10,
                price: 100,
                keyword: ["keyword"],
                measurement: "Piece",
                images: ["Image.jpg"],

            })

            await product.save();

            const productId = product._id;

            const specialoffer = SpecialOffer({
                    userId:"5fc006f71ebba134c80c9e89",
                    productId:productId,
                    title: "jeans",
                    discount: 100,
                })

            await specialoffer.save();

            const res = await request(server)
                .post(`/specialOffer/openSpecialOffer/`+specialoffer._id)
                .send({
                    productId:productId,
                })
            expect(res.status).toBe(200);
        })
       
    })


    describe('POST /closeSpecialOffer/:specialOfferId', () => {
       
        it('should return 400 if specialOfferId is not valid(to close special offer)', async () => {
            const res = await request(server).post(`/specialOffer/closeSpecialOffer/11`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if product is not found(to close special offer)', async () => {
            const res = await request(server)
                .post(`/specialOffer/closeSpecialOffer/5fc006f71ebba134c80c9e89`)
                .send({
                    productId:"5fc006f71ebba134c80c9e89",
                    title: "jeans",
                    discount: 100,
                })
            expect(res.status).toBe(404);
        })


        it('should return 404 if special offer is not found(to close special offer)', async () => {

            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
                productName: "jeans",
                productCategory: "Cloth",
                productSubCategory: "Trouser",
                description: "It Is Brand New Jeans",
                minOrder: 10,
                price: 100,
                keyword: ["keyword"],
                measurement: "Piece",
                images: ["Image.jpg"],

            })

            await product.save();

            const productId = product._id;

            const res = await request(server)
                .post(`/specialOffer/closeSpecialOffer/5fc006f71ebba134c80c9e89`)
                .send({
                    productId:productId,
                })
            expect(res.status).toBe(404);
        })

        
        it('should return 200 and special offer is closed', async () => {

            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
                productName: "jeans",
                productCategory: "Cloth",
                productSubCategory: "Trouser",
                description: "It Is Brand New Jeans",
                minOrder: 10,
                price: 100,
                keyword: ["keyword"],
                measurement: "Piece",
                images: ["Image.jpg"],

            })

            await product.save();

            const productId = product._id;

            const specialoffer = SpecialOffer({
                    userId:"5fc006f71ebba134c80c9e89",
                    productId:productId,
                    title: "jeans",
                    discount: 100,
                })

            await specialoffer.save();

            const openspecial = await request(server)
            .post(`/specialOffer/openSpecialOffer/`+specialoffer._id)
            .send({
                productId:productId,
            })


            const res = await request(server)
                .post(`/specialOffer/closeSpecialOffer/`+specialoffer._id)
                .send({
                    productId:productId,
                })
            expect(res.status).toBe(200);
        })
       
    })


    describe('DELETE /deleteOffer/:productId', () => {
       
        it('should return status 400 if productId is not valid(to delete special offer)', async () => {
            const res = await request(server).delete(`/specialOffer/deleteOffer/11`);

            expect(res.status).toBe(400);
        })

        it('should return status 404 if product is not found(to delete special offer)', async () => {
            const res = await request(server).delete(`/specialOffer/deleteOffer/5fc006f71ebba134c80c9e89`);
                
            expect(res.status).toBe(404);
        })

        
        it('should return status 200 and special offer is deleted from the product', async () => {

            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
                productName: "jeans",
                productCategory: "Cloth",
                productSubCategory: "Trouser",
                description: "It Is Brand New Jeans",
                minOrder: 10,
                price: 100,
                keyword: ["keyword"],
                measurement: "Piece",
                images: ["Image.jpg"],

            })

            await product.save();

            const productId = product._id;

            const specialoffer = SpecialOffer({
                    userId:"5fc006f71ebba134c80c9e89",
                    productId:productId,
                    title: "jeans",
                    discount: 100,
                })

            await specialoffer.save();

            const openspecial = await request(server)
            .post(`/specialOffer/openSpecialOffer/`+specialoffer._id)
            .send({
                productId:productId,
            })

            const res = await request(server).delete(`/specialOffer/deleteOffer/`+productId);
            
            expect(res.status).toBe(200);
        })
       
    })

    describe('GET /getPendingSpecialOffer', () => {

        it('should return status 200 and return pending special offer', async () => {
            const res = await request(server).get(`/specialOffer/getPendingSpecialOffer`);

            expect(res.status).toBe(200);
        })
    })  

    describe('GET /getMyActiveSpecialOffer', () => {

        it('should return status 200 and return active special offer added by user', async () => {
            const res = await request(server).get(`/specialOffer/getMyActiveSpecialOffer`);

            expect(res.status).toBe(200);
        })
    })  

    describe('GET /getMyActiveSpecialOffer', () => {

        it('should return status 200 and return active special offer added by user', async () => {
            const res = await request(server).get(`/specialOffer/getMyActiveSpecialOffer`);

            expect(res.status).toBe(200);
        })
    })  

    describe('GET /getAllActiveSpecialOffer', () => {

        it('should return status 200 and return all active special offer added', async () => {
            const res = await request(server).get(`/specialOffer/getAllActiveSpecialOffer`);

            expect(res.status).toBe(200);
        })
    }) 
    
    describe('GET /getActiveSpecialOffer/:offset/:limit', () => {

        it('should return status 200 and return all active special offer( offset and limit given)', async () => {
            const res = await request(server).get(`/specialOffer/getActiveSpecialOffer/0/4`);

            expect(res.status).toBe(200);
        })
    }) 


    describe('GET /getAllActiveSpecialOfferByCategory/:productCategory', () => {

        it('should return status 200 and return all special offer by category', async () => {
            const res = await request(server).get(`/specialOffer/getAllActiveSpecialOfferByCategory/clothes`);

            expect(res.status).toBe(200);
        })
    }) 

    describe('GET /getActiveSpecialOfferByCategory/:productSubCategory/:offset/:limit', () => {

        it('should return status 200 and return special offer by category(offset and limit given)', async () => {
            const res = await request(server).get(`/specialOffer/getActiveSpecialOfferByCategory/clothes/0/4`);

            expect(res.status).toBe(200);
        })
    }) 

    describe('GET /getAllActiveSpecialOfferBySubCategory/:productSubCategory', () => {

        it('should return status 200 and return all special offer by sub category', async () => {
            const res = await request(server).get(`/specialOffer/getAllActiveSpecialOfferBySubCategory/jeans`);

            expect(res.status).toBe(200);
        })
    }) 

    describe('GET /getActiveSpecialOfferBySubCategory/:productSubCategory/:offset/:limit', () => {

        it('should return status 200 and return special offer by sub category(offset and limit given)', async () => {
            const res = await request(server).get(`/specialOffer/getActiveSpecialOfferBySubCategory/jeans/0/4`);

            expect(res.status).toBe(200);
        })
    }) 


    describe('GET /getProductInSpecialOffer/:productId', () => {

        it('should return status 400 if productId is not valid(to view details of special offer)', async () => {
            const res = await request(server).get(`/specialOffer/getProductInSpecialOffer/11`);

            expect(res.status).toBe(400);
        })

        it('should return status 200 and return special offer details', async () => {


            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
                productName: "jeans",
                productCategory: "Cloth",
                productSubCategory: "Trouser",
                description: "It Is Brand New Jeans",
                minOrder: 10,
                price: 100,
                keyword: ["keyword"],
                measurement: "Piece",
                images: ["Image.jpg"],

            })

            await product.save();

            const productId = product._id;

            const specialoffer = SpecialOffer({
                    userId:"5fc006f71ebba134c80c9e89",
                    productId:productId,
                    title: "jeans",
                    discount: 100,
                })

            await specialoffer.save();

            const openspecial = await request(server)
            .post(`/specialOffer/openSpecialOffer/`+specialoffer._id)
            .send({
                productId:productId,
            })

           
            const res = await request(server).get(`/specialOffer/getProductInSpecialOffer/`+productId);

            expect(res.status).toBe(200);
        })
    }) 


});