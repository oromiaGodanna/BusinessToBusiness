export{}
const mongoose = require('mongoose');
const request = require('supertest');
const bcyrpt = require('bcrypt');
const {generateAuthToken} = require('../../src/models/user');
const { Customer } = require('../../src/models/customer');
let server;


describe('customer', () => {
    beforeEach(() => { 
        server = require('../../src/server'); 
        jest.setTimeout(50000);
    })
    afterEach(async () => {
        server.close();
        await Customer.remove({});
    });

    describe('POST /register', () => {
        it('should return a 400 if there is customer has a validation error', async() => {
          const res =  await request(server)
           .post('/customer/register')
           .send({});
           expect(res.status).toBe(400);
        });

        it('should return 400 if the email has already been used', async() => {
            const customer = new Customer({ email: 'customer@gmail.com', password: 'Password@123', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 });
            await customer.save();
            const res =  await request(server)
            .post('/customer/register')
            .send({ email: 'customer@gmail.com', password: 'Password@123', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 });
            expect(res.status).toBe(400);
        });

        // it('should save customer if it is valid', async() => {
        //     const res =  await request(server)
        //     .post('/customer/register')
        //     .send({ email: 'customer1@gmail.com', password: 'Password@123', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 });
        //     //const customer = await Customer.find({email: 'customer@gmail.com'})
        //     expect(res.status).toBe(200);
        //     //expect(customer).not.toBeNull();
        // });

        // it('should return the customer if it is valid', async() => {
        //     const res =  await request(server)
        //     .post('/customer/register')
        //     .send({ email: 'customer@gmail.com', password: 'Password@123', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 }); 
        //     expect(res.body).toHaveProperty('-id');
        //     expect(res.body).toHaveProperty('email', 'customer@gmail.com');
        // });
    });

      describe('GET /email_confirmation /:token', () => {

        // it('should return 401 if token is invalid', async() => {
        //     const res =  await request(server).get('/customer/email_confirmation/abcd');
        //     expect(res.status).toBe(401);
        // });

        // it('should return 400 if token is invalid', async() => {
        //     const res =  await request(server).get('/customer/email_confirmation/a');
        //    expect(res.status).toBe(400);
        // });

        // it('should return 200 if token is valid', async()=>{
        //     const payload = {
        //         _id: new mongoose.Types.ObjectId().toHexString(), 
        //         firstName: 'Abebe', 
        //         lastName: 'Kebede', 
        //         email: "example@gmail.com", 
        //         userType: 'Both'
        //     };
        //     const token = generateAuthToken(payload);
        //     const res =  await request(server).get('/customer/email_confirmation/a');
        //     expect(res.status).toBe(200);
        // });
    })

    // describe('POST /resend_confirmation' , () => {
    //     it('should return 404 if user user email can not be found', async() => {
    //         const res = await request(server)
    //         .post('/customer/resend_confirmation')
    //         .send({email: 'customer@gmail.com'});
    //         expect(res.status).toBe(404);
    //     });

    //     it('should return 200 if user email is found', async ()=> {
    //         const customer = new Customer({ email: 'customer@gmail.com', password: 'Password@123', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 });
    //         await customer.save();
    //         const res = await request(server)
    //         .post('/customer/resend_confirmation')
    //         .send({email: 'customer@gmail.com'});
    //         expect(res.status).toBe(200);
    //     });
    // });


    // describe('GET /', () => {
    //     it('should return all customers', async () => {
    //         // Customer.collection.insertMany([
    //         //    {email: 'customer1@gmail.com', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890},
    //         //     {email: 'customer2@gmail.com', firstName: 'Customer', lastName: "Two", userType: 'Seller', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerTWO', tinNumber: 1234567890}
    //         //     ]);
    //         const res = await request(server).get('/customer/');
    //         expect(res.status).toBe(200);
    //         //expect(res.body.length).toBe(2);
    //         //expect(res.body.some(c => c.email === 'cusomter1@gmail.com')).toBeTruthy();
    //         //expect(res.body.some(c => c.email === 'cusomter2@gmail.com')).toBeTruthy();
    //     });
    // });

    // describe('GET /:id', () => {

    //     it('should return 200a customer if valid id is passed', async () => {
    //         const customer = new Customer({ email: 'customer1@gmail.com', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 });
    //         await customer.save();
    //         const res = await request(server).get('/customer/' + customer._id);
    //         expect(res.status).toBe(200);
    //         //expect(res.body).toHaveProperty('email', customer.email);
    //     });

    //     it('should return 404  if invalid id is passed', async () => {
    //         const res = await request(server).get('/customer/1');
    //         expect(res.status).toBe(404);
    //     });
    // });

    

  
    // describe('POST /login' , () => {
    //     let customer;
    //     beforeEach(async() => {
    //         const customerData = { email: 'customer@gmail.com', password: 'Password@123', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 }
    //         const salt = await bcyrpt.genSalt(10);
    //         customerData.password = await bcyrpt.hash(customerData.password, salt);
    //         customer = new Customer(customerData);
    //         await customer.save();
    //      })
       
    //     it('should return 400 is email is empty' , async() => {
    //         const res = await request(server)
    //         .post('/customer/login')
    //         .send({password: 'Password@123'});
    //         expect(res.status).toBe(400);
    //     });

    //     it('should return 400 is password is empty' , async() => {
    //         const res = await request(server)
    //         .post('/customer/login')
    //         .send({email: 'customer@gmail.com'});
    //         expect(res.status).toBe(400);
    //     });

    //     it('should return 400 is email is invalid', async() => {
    //         const res = await request(server)
    //         .post('/customer/login')
    //         .send({email: 'a@gmail.com', password: 'Password@123'});
    //         expect(res.status).toBe(400);
    //     });

    //     it('should return 400 if password is invalid', async() => {
    //         customer = await Customer.findOneAndUpdate({ email: customer.email }, { verified: true }, { new: true });
    //         const res = await request(server)
    //         .post('/customer/login')
    //         .send({email: 'customer@gmail.com', password: 'a'});
    //         expect(res.status).toBe(400);
    //     });

    //     it('should return 403 if user is not verified', async() => {
    //         const res = await request(server)
    //         .post('/customer/login')
    //         .send({email: 'customer@gmail.com', password: 'Password@123'});
    //         expect(res.status).toBe(403);
    //     });
        
    //     it('should return 200 if both email and password are valid and customer is verified', async() => {
    //         customer = await Customer.findOneAndUpdate({ email: customer.email }, { verified: true }, { new: true });
    //         const res = await request(server)
    //         .post('/customer/login')
    //         .send({email: 'customer@gmail.com', password: 'Password@123'});
    //         expect(res.status).toBe(200);
    //     });
    // });

    // describe('PUT / updateProfile /:id', () => {
    // });

    // describe('POST /deleteRequest /:id', () => {
    //     it('should return 400 if a delete request is not valid', async() => {
    //         const customer = new Customer({ email: 'customer1@gmail.com', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 });
    //         await customer.save();
    //         const res =  await request(server)
    //              .post('/customer/deleteRequest/' + customer._id)
    //              .send({});
    //              expect(res.status).toBe(400);
    //     });
    //     it('should return 404 if customer with this id can not be founc', async() => {
    //         const res =  await request(server)
    //         .post('/customer/deleteRequest/1')
    //         .send({name: 'Customer 1', email: 'customer1@gmail.com', reason: 'reason for leaving'});
    //         expect(res.status).toBe(404);
    //     })

    //     it('should return 200 if both id and request data is valid ', async() => {
    //         const customer = new Customer({ email: 'customer1@gmail.com', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890 });
    //         await customer.save();
    //         const res =  await request(server)
    //              .post('/customer/deleteRequest/' + customer._id)
    //              .send({name: 'Customer 1', email: 'customer1@gmail.com', reason: 'reason for leaving'});
    //              expect(res.status).toBe(200);
    //     })

    // });
    
    // describe('DELETE /:id', () => {
    //     // it('should return 404 if customer with this id can not be found', async() => {
    //     //     const res =  await request(server)
    //     //          .delete('/customer/1');
    //     //          expect(res.status).toBe(404);
    //     // });

    //     // it('should return 403 if user has an active order', async() => {
    //     //     const customer = new Customer({ email: 'customer1@gmail.com', firstName: 'Customer', lastName: "One", userType: 'Buyer', mobile: '0911234567', country: 'Ethiopia', companyName: 'customerOne', tinNumber: 1234567890, orderIds: [new mongoose.Types.ObjectId().toHexString()] });
    //     //     await customer.save();
    //     //     const res =  await request(server)
    //     //          .delete('/customer/' + customer._id);
    //     //         expect(res.status).toBe(403);
    //     // });

    // });

    // describe('PUT /changePassword /:id', () => {
    //     it('should return 400 is new password is invalid', () => {

    //     });

    //     it('should return 404 is customer is not found', () => {

    //     });

    //     it('should return 403 if old wrong password is invalid', () => {

    //     });

    //     it('should return 200 if both new and old password is valid', () => {

    //     });
    // });

    // describe('PUT /changeEmail /:id', () => {

    // });

    // describe('PUT /subscribe /:id', () => {

    // });

    // describe('PUT /unsubscribe /:id', () => {

    // });

    // describe('PUT /forgotPassword', () => {

    // });

    // describe('PUT /resetPassword /:token', () => {

    // });

});


