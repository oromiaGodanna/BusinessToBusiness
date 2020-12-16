export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { WishList } = require('../../src/models/wishList');
const { Product } = require('../../src/models/product');
const { Buyer } = require('../../src/models/customer');
const { Customer } = require('../../src/models/customer');
const server = require('../../src/server');
//let server;
let user;
let token;
describe(' Wishlist ', () => {

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
    
    
    
        beforeAll(async (done) => {
    
            const url = 'mongodb://localhost/b2b_tests';
            await mongoose.connect(url, { useNewUrlParser: true });
    
            // users.forEach(async (user) => {
            //     await request(server)
            //         .post('/customer/register')
            //         .send(user)
            //         .then((err, response) => {
            //             // console.log('for register')
            //             // console.log(JSON.stringify(response));
            //             // console.log(err.text)
            //         })
            // })
    
            await request(server)
                .post('/customer/register')
                .send(users[0]);
            await request(server)
                .post('/customer/register')
                .send(users[1]);
            await request(server)
                .post('/customer/register')
                .send(users[2]);
    
            // let customers = await Customer.insertMany(users);
            // console.log(customers);
            let customers = await Customer.find({});
            console.log(`customers: ${customers}`);
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
                    loggedInUserId = response.body.user._id;
                    console.log(JSON.stringify(response));
                    // console.log(response.status);
                    // console.log(response.body);
                    // console.log(`token: ${token}`);





                    done();
                })
    
        });
    
    
        afterEach(async () => {
            await WishList.deleteMany({});
            await Buyer.deleteMany({});
            await Product.deleteMany({});
            server.close();
        });
    
        afterAll(() => {
            server.close();
        });
    

   describe('POST /addToWishList', () => {

        it('It should return status 400 since product is not valid.', async () => {
            const res = await request(server)
                .post(`/wishlist/addToWishList`)
                .set('token',token)
                .send({
                   productIds:"1111111"
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 400 since product is not valid.', async () => {
            const res = await request(server)
                .post(`/wishlist/addToWishList`)
                .set('token',token)
                .send({
                  
                })

            expect(res.status).toBe(400);

        })

        it('It should return status 404 since product is not found.', async () => {
            const res = await request(server)
                .post(`/wishlist/addToWishList`)
                .set('token',token)
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
                .set('token',token)
                .send({
                    productIds:product._id
                })

            expect(res.status).toBe(200);

        })
        
    });

   

    describe('GET /getWishList', () => {

        it('It should return status 200 and products in wishlist.', async () => {
            const res = await request(server).get(`/wishlist/getWishList`).set('token',token);
            expect(res.status).toBe(200);
        })

    });

    describe('DELETE /removeFromWishList/:id', () => {

        it('It should return status 400 if product id is invalid.', async () => {
            const res = await request(server).delete(`/wishlist/removeFromWishList/111`).set('token',token);
            //const res = await request(server).get(`/product/getAllProducts`);
            expect(res.status).toBe(400);
        })

        it('It should return status 200 and remove product from wishlist', async () => {
            const res = await request(server).delete(`/wishlist/removeFromWishList/5fc006f71ebba134c80c9e89`).set('token',token);
            //const res = await request(server).get(`/product/getAllProducts`);
            expect(res.status).toBe(200);
        })

    })

    describe('GET /countProductInWishlist', () => {

        it('It should return status 200 and number of products in wishlist', async () => {
            const res = await request(server).get(`/wishlist/countProductInWishlist`).set('token',token);
            //const res = await request(server).get(`/product/getAllProducts`);
            expect(res.status).toBe(200);
        })

      
       
    })

});