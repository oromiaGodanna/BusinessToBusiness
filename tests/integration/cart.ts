export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { Cart } = require('../../src/models/cart');
const { Product } = require('../../src/models/product');
const { Buyer } = require('../../src/models/customer');
const server = require('../../src/server');
//let server;
let user;
let token;
describe(' Cart ', () => {

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
        await Cart.deleteMany({});
        await Buyer.deleteMany({});
        await Product.deleteMany({});
        server.close();
    });

   describe('POST /addToCart', () => {

        it('It should return status 400 since product id is not valid.', async () => {
            const res = await request(server)
                .post(`/cart/addToCart`)
                //token here .set('token',token)
                .send({
                   productId:"1111111"
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 if validation error.', async () => {
            const res = await request(server)
                .post(`/cart/addToCart`)
                //token here .set('token',token)
                .send({
                    productId:"5fc006f71ebba134c80c9e89",
                    amount:"amount"
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 404 if product not found.', async () => {
            const res = await request(server)
                .post(`/cart/addToCart`)
                //token here .set('token',token)
                .send({
                    productId:"5fc006f71ebba134c80c9e89",
                    amount:300
                })

            expect(res.status).toBe(404);

        })

        it('It should return status 200 and add product to cart.', async () => {

            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
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

            await product.save();

            const productId = product._id;

            const res = await request(server)
                .post(`/cart/addToCart`)
                //token here .set('token',token)
                .send({
                    productId:product._id,
                    amount:200
                })

            expect(res.status).toBe(200);

        })
        
    });

    describe('GET /getCart', () => {

        it('It should return status 200 and products in wishlist.', async () => {
            const res = await request(server).get(`/cart/getCart`);
            expect(res.status).toBe(200);
        })

    });

    describe('DELETE /removeFromCart/:id', () => {

        it('It should return status 400 if product id is invalid.', async () => {
            const res = await request(server).delete(`/cart/removeFromCart/111`);
            expect(res.status).toBe(400);
        })
        

        it('It should return status 200 if product found it will update the cart', async () => {
            const res = await request(server).delete(`/cart/removeFromCart/5fc006f71ebba134c80c9e89`);
            expect(res.status).toBe(200);
        })

    })

   
    describe('GET /countProductInCart', () => {

        it('It should return status 200 and number of products in cart', async () => {
            const res = await request(server).get(`/cart/countProductInCart`);
            expect(res.status).toBe(200);
        })

      
       
    })
    
 
});