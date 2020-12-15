export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { WishList } = require('../../src/models/wishList');
const { Product } = require('../../src/models/product');
const { Buyer } = require('../../src/models/customer');
const server = require('../../src/server');
//let server;
let user;
let token;
describe(' Wishlist ', () => {

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
        await WishList.deleteMany({});
        await Buyer.deleteMany({});
        await Product.deleteMany({});
        server.close();
    });

   describe('POST /addToWishList', () => {

        it('It should return status 400 since product is not valid.', async () => {
            const res = await request(server)
                .post(`/wishlist/addToWishList`)
                //token here .set('token',token)
                .send({
                   productIds:"1111111"
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 since product is not valid.', async () => {
            const res = await request(server)
                .post(`/wishlist/addToWishList`)
                //token here .set('token',token)
                .send({
                  
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 404 since product is not found.', async () => {
            const res = await request(server)
                .post(`/wishlist/addToWishList`)
                //token here .set('token',token)
                .send({
                   productIds:"5fc006f71ebba134c80c9e89"
                })

            expect(res.status).toBe(404);

        })

        it('It should return status 200 and add product to wishlist.', async () => {

            const product = Product({
                userId:"5fc006f71ebba134c80c9e89",
                productName: "jeans",
                productCategory: "Cloth",
                productSubCategory: "Trouser",
                description: "It Is Brand New Jeans",
                minOrder: "10",
                price: "100",
                keyword: ["keyword"],
                measurement: "Piece",
                images: ["Image.jpg"],

            })

            await product.save();

            const productId = product._id;

            const res = await request(server)
                .post(`/wishlist/addToWishList`)
                //token here .set('token',token)
                .send({
                    productIds:product._id
                })

            expect(res.status).toBe(200);

        })
        
    });

   

    describe('GET /getWishList', () => {

        it('It should return status 200 and products in wishlist.', async () => {
            const res = await request(server).get(`/wishlist/getWishList`);
            expect(res.status).toBe(200);
        })

    });

    describe('DELETE /removeFromWishList/:id', () => {

        it('It should return status 400 if product id is invalid.', async () => {
            const res = await request(server).delete(`/wishlist/removeFromWishList/111`);
            //const res = await request(server).get(`/product/getAllProducts`);
            expect(res.status).toBe(400);
        })

        it('It should return status 200 and remove product from wishlist', async () => {
            const res = await request(server).delete(`/wishlist/removeFromWishList/5fc006f71ebba134c80c9e89`);
            //const res = await request(server).get(`/product/getAllProducts`);
            expect(res.status).toBe(200);
        })

    })

    describe('GET /countProductInWishlist', () => {

        it('It should return status 200 and number of products in wishlist', async () => {
            const res = await request(server).get(`/wishlist/countProductInWishlist`);
            //const res = await request(server).get(`/product/getAllProducts`);
            expect(res.status).toBe(200);
        })

      
       
    })

    
 
});