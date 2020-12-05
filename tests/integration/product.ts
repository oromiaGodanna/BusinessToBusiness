export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { Product } = require('../../src/models/product');
const { auth } = require('../../src/middleware/auth');
const server = require('../../src/server');
//let server;
let user;
let token;
describe(' Product ', () => {

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
        server.close();
    });

    describe('POST /createProduct', () => {
       
        it('It should return status 400 since product Name has error.', async () => {
            const res = await request(server)
                .post(`/product/createProduct`)
                //token here .set('token',token)
                .send({
                    userId:"5fc006f71ebba134c80c9e89",
                    productName: 11111,
                    productCategory: "Cloth",
                    productSubCategory: "Trouser",
                    description: "It Is Brand New Jeans",
                    minOrder: 111,
                    price:111,
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],
                    additionalProductInfo: ["white"]

                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 since product category has error.', async () => {
            const res = await request(server)
                .post(`/product/createProduct`)
                //token here .set('token',token)
                .send({
                    userId:"5fc006f71ebba134c80c9e89",
                    productName: "cloth",
                    productCategory: 1111,
                    productSubCategory: "Trouser",
                    description: "It Is Brand New Jeans",
                    minOrder: 111,
                    price:111,
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],
                    additionalProductInfo: ["white"]

                })

            expect(res.status).toBe(400);

        })


        it('It should return status 400 since product sub-category has error.', async () => {
            const res = await request(server)
                .post(`/product/createProduct`)
                //token here .set('token',token)
                .send({
                    userId:"5fc006f71ebba134c80c9e89",
                    productName: "cloth",
                    productCategory: "jeans",
                    productSubCategory: 11111,
                    description: "It Is Brand New Jeans",
                    minOrder: 111,
                    price:111,
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],
                    additionalProductInfo: ["white"]

                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 since min order has error.', async () => {
            const res = await request(server)
                .post(`/product/createProduct`)
                //token here .set('token',token)
                .send({
                    userId:"5fc006f71ebba134c80c9e89",
                    productName: "cloth",
                    productCategory: "trouser",
                    productSubCategory: "jeans",
                    description: "It Is Brand New Jeans",
                    minOrder: 1,
                    price:111,
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],
                    additionalProductInfo: ["white"]

                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 since price has error.', async () => {
            const res = await request(server)
                .post(`/product/createProduct`)
                //token here .set('token',token)
                .send({
                    userId:"5fc006f71ebba134c80c9e89",
                    productName: "cloth",
                    productCategory: "trouser",
                    productSubCategory: "jeans",
                    description: "It Is Brand New Jeans",
                    minOrder: 1111,
                    price:"111",
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],
                    additionalProductInfo: ["white"]

                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 since keyword has error.', async () => {
            const res = await request(server)
                .post(`/product/createProduct`)
                //token here .set('token',token)
                .send({
                    userId:"5fc006f71ebba134c80c9e89",
                    productName: "cloth",
                    productCategory: "trouser",
                    productSubCategory: "jeans",
                    description: "It Is Brand New Jeans",
                    minOrder: 1111,
                    price:1111,
                    keyword: "keyword",
                    measurement: "Piece",
                    images: ["Image.jpg"],
                    additionalProductInfo: ["white"]

                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 since Image has error.', async () => {
            const res = await request(server)
                .post(`/product/createProduct`)
                //token here .set('token',token)
                .send({
                    userId:"5fc006f71ebba134c80c9e89",
                    productName: "cloth",
                    productCategory: "trouser",
                    productSubCategory: "jeans",
                    description: "It Is Brand New Jeans",
                    minOrder: 1111,
                    price:1111,
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: null,
                    additionalProductInfo: ["white"]

                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 since Additional Info has error.', async () => {
            const res = await request(server)
                .post(`/product/createProduct`)
                //token here .set('token',token)
                .send({
                    userId:"5fc006f71ebba134c80c9e89",
                    productName: "cloth",
                    productCategory: "trouser",
                    productSubCategory: "jeans",
                    description: "It Is Brand New Jeans",
                    minOrder: 1111,
                    price:1111,
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],
                    additionalProductInfo: "white"

                })

            expect(res.status).toBe(400);

        })

        it('It should add product.', async () => {

            const res = await request(server)
                .post(`/product/createProduct`)
                //token heree .set('token',token)
                .send({
                    productName: "jeans",
                    productCategory: "Cloth",
                    productSubCategory: "Trouser",
                    description: "It Is Brand New Jeans",
                    minOrder: 1000,
                    price: 100,
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],

                })

            expect(res.status).toBe(200);

        })
    })

    describe('POST /updateProduct/:id', () => {

        it('It should return status 400 since product Id is invalid', async () => {
            const res = await request(server)
                .post(`/product/updateProduct/`+"111")
                //token here .set('token',token)
                .send({
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

            expect(res.status).toBe(400);

        })

       
        it('It should return status 404 since product is not found(to update)', async () => {
            const res = await request(server)
                .post(`/product/updateProduct/`+"5fc006f71ebba134c80c9e89")
                //token here .set('token',token)
                .send({
                    productName: "jeans",
                    productCategory: "Cloth",
                    productSubCategory: "Trouser",
                    description: "It Is Brand New Jeans",
                    minOrder: 100,
                    price: 100,
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],

                })

            expect(res.status).toBe(404);

        })

        it('It should return status 400 validation error (to update)', async () => {

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
                .post(`/product/updateProduct/`+productId)
                //token here .set('token',token)
                .send({
                    productName: "jeans",
                   
                    productSubCategory: "Trouser",
                    description: "It Is Brand New Jeans",
                    minOrder: "10",
                    price: "100",
                    keyword: ["keyword"],
                    measurement: "Piece",
                    images: ["Image.jpg"],

                })

            expect(res.status).toBe(400);

        })

        /*it('It should return status 200 and update product', async () => {

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
                .post(`/product/updateProduct/`+productId)
                //token hereeee .set('token',token)
                .send({
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

            expect(res.status).toBe(200);

        })*/

    });

    describe('GET /getProducts/:offset/:limit', () => {

        it('should return 200 and return products with offset and limit', async () => {
            const res = await request(server).get(`/product/getProducts/0/4`);

            expect(res.status).toBe(200);
        })
    })

    describe('GET /getAllProducts', () => {

        it('should return 200 and return all products', async () => {
            const res = await request(server).get(`/product/getAllProducts`);

            expect(res.status).toBe(200);
        })
    })

    describe('GET /getProduct/:id', () => {

        it('should return 400 if Id is not valid', async () => {
            const res = await request(server).get(`/product/getProduct/11`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if product not found', async () => {
            const res = await request(server).get(`/product/getProduct/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);
        })


        it('should return 200 and product is returned', async () => {

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

            const res = await request(server).get(`/product/getProduct/`+ productId);

            expect(res.status).toBe(200);
        })



    })

    describe('GET /getProductSeller/:userId', () => {

        it('should return 400 if userId is not valid', async () => {
            const res = await request(server).get(`/product/getProductSeller/11`);

            expect(res.status).toBe(400);
        })

        it('should return 200 if userId is valid', async () => {
            const res = await request(server).get(`/product/getProductSeller/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(200);
        })
        
    })


    describe('GET /getRelatedProductByCategory/:subCategory/:offset/:limit', () => {

        it('should return 200 and return products under specific category with offset and limit', async () => {
            const res = await request(server).get(`/product/getRelatedProductByCategory/clothes/0/4`);

            expect(res.status).toBe(200);
        })
    })

    describe('GET /getAllRelatedProductByCategory/:category', () => {

        it('should return 200 and return all products  under specific category', async () => {
            const res = await request(server).get(`/product/getAllRelatedProductByCategory/clothes`);

            expect(res.status).toBe(200);
        })
    })

    describe('GET /getRelatedProductBySubCategory/:subCategory/:offset/:limit', () => {

        it('should return 200 and return products under specific subcabtegory with offset and limit', async () => {
            const res = await request(server).get(`/product/getRelatedProductBySubCategory/clothes/0/111`);

            expect(res.status).toBe(200);
        })
    })

    describe('GET /getAllRelatedProductBySubCategory/:subCategory', () => {

        it('should return 200 and return all products under specific subcabtegory', async () => {
            const res = await request(server).get(`/product/getAllRelatedProductBySubCategory/clothes`);

            expect(res.status).toBe(200);
        })
    })


    describe('DELETE /deleteProduct/:id', () => {
        //token heree .set('token',token)
        
        it('should return 400 if id is not valid (to delete)', async () => {
            const res = await request(server).delete(`/product/deleteProduct/11`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if product to be deleted is not found', async () => {
            const res = await request(server).delete(`/product/deleteProduct/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);
        })

        /*it('should return 200 and delete the product', async () => {

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
            const res = await request(server).delete(`/product/deleteProduct/`+productId);
            expect(res.status).toBe(200);
        })*/
    })

    describe('POST /filter/:offset/:limit', () => {

        it('should return 400 if validation for filter failed', async () => {
            const res = await request(server).post(`/product/filter/0/10`);
            expect(res.status).toBe(400);
        })

        it('should return 400 if validation for filter failed', async () => {
            const res = await request(server)
            .post(`/product/filter/0/10`)
            .send({

                productSubCategory:"jeans",
                maxPrice:111,
            });
            expect(res.status).toBe(400);
        })

        it('should return 400 if validation for filter failed', async () => {
            const res = await request(server)
            .post(`/product/filter/0/10`)
            .send({
                productCategory:"clothes",
                maxPrice:1111,
            });
            expect(res.status).toBe(400);
        })

        it('should return 400 if validation for filter failed', async () => {
            const res = await request(server)
            .post(`/product/filter/0/10`)
            .send({
                productCategory:"clothes",
                productSubCategory:"jeans",
            });
            
            expect(res.status).toBe(400);
        })
        

        it('should return 200 and filter products', async () => {
            const res = await request(server)
            .post(`/product/filter/0/10`)
            .send({
                productCategory:"clothes",
                productSubCategory:"jeans",
                maxPrice:100,
            });
            expect(res.status).toBe(200);
        })
        
    })

    describe('GET /search/:searchWord/:offset/:limit', () => {


        it('should return 200 and search results(products found)', async () => {
            const res = await request(server).get(`/product/search/clothes/0/10`);
            expect(res.status).toBe(200);
        })
    })


});