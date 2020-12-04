export { };

const request = require('supertest');
const mongoose = require('mongoose');
const { Category } = require('../../src/models/category');
const { Admin } = require('../../src/models/user');
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
        await Category.deleteMany({});
        await Admin.deleteMany({});
        server.close();
    });

    describe('POST /addCategory', () => {
       
        it('It should return status 400 if validation has error(to add category).', async () => {
            const res = await request(server)
                .post(`/category/addCategory`)
                //token here .set('token',token)
                .send({
                    categoryName: null,
                    subCategories: [null],
                    image: "Image.jpg"

                })

            expect(res.status).toBe(400);

        })

        it('It should return status 200 and add category.', async () => {
            const res = await request(server)
                .post(`/category/addCategory`)
                //token here .set('token',token)
                .send({
                    categoryName: "clothes",
                    subCategories: [],
                    image: "Image.jpg"

                })

            expect(res.status).toBe(200);

        })

        describe('POST /editCategory/:id', () => {

            it('It should return status 400 if category Id is invalid', async () => {
                const res = await request(server)
                    .post(`/category/editCategory/`+"111")
                    //token here .set('token',token)
                    .send({
                        categoryName: "clothes",
                        subCategories: [],
                        image: "Image.jpg"
    
                    })
    
                expect(res.status).toBe(400);
    
            })
    
           
            it('It should return status 404 since category is not found(to update)', async () => {
                const res = await request(server)
                    .post(`/category/editCategory/`+"5fc006f71ebba134c80c9e89")
                    //token here .set('token',token)
                    .send({
                        categoryName: "clothes",
                        subCategories: [],
                        image: "Image.jpg"
                    })
    
                expect(res.status).toBe(404);
    
            })


            it('It should return status 400 if validation has error(to update category).', async () => {
                const category = Category({
                    categoryName: "clothes",
                    subCategories: [],
                    image: "Image.jpg"
    
                })
    
                await category.save();
                const categoryId = category._id;
                const res = await request(server)
                    .post(`/category/editCategory/`+categoryId)
                    //token hereeee .set('token',token)
                    .send({
                        categoryName: null,
                        subCategories: [],
                        image: "Image.jpg"
    
                    })
    
                expect(res.status).toBe(400);
    
            })
    
            
    
            it('It should return status 200 and update category', async () => {
    
                const category = Category({
                    categoryName: "clothes",
                    subCategories: [],
                    image: "Image.jpg"
    
                })
    
                await category.save();
                const categoryId = category._id;
                const res = await request(server)
                    .post(`/category/editCategory/`+categoryId)
                    //token hereeee .set('token',token)
                    .send({
                        categoryName: "clothes",
                        subCategories: [],
                        image: "Image.jpg"
    
                    })
    
                expect(res.status).toBe(200);
    
            })
    
        });
        
    })

    describe('GET /getCategories', () => {

        it('should return 200 and return categories', async () => {
            const res = await request(server).get(`/category/getCategories`);

            expect(res.status).toBe(200);
        })
    })
        
    describe('GET /getCategory/:id', () => {

        it('should return 400 if category id is not valid', async () => {
            const res = await request(server).get(`/category/getCategory/11`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if category is not found', async () => {
            const res = await request(server).get(`/category/getCategory/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);
        })

        it('It should return status 200 and get category by id', async () => {
    
            const category = Category({
                categoryName: "clothes",
                subCategories: [],
                image: "Image.jpg"

            })

            await category.save();
            const categoryId = category._id;
            const res = await request(server).get(`/category/getCategory/`+categoryId);

            expect(res.status).toBe(200);

        })

    })

    describe('DELETE /deleteCategory/:id', () => {

        it('should return 400 if category id is not valid', async () => {
            const res = await request(server).delete(`/category/deleteCategory/11`);

            expect(res.status).toBe(400);
        })

        it('should return 404 if category is not found', async () => {
            const res = await request(server).delete(`/category/deleteCategory/5fc006f71ebba134c80c9e89`);

            expect(res.status).toBe(404);
        })

        it('It should return status 200 and delete category', async () => {
    
            const category = Category({
                categoryName: "clothes",
                subCategories: [null],
                image: "Image.jpg"

            })

            await category.save();
            const categoryId = category._id;
            const res = await request(server).delete(`/category/deleteCategory/`+categoryId);

            expect(res.status).toBe(200);

        })

    })
   

  
});