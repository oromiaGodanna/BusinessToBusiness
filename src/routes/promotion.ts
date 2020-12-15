import express from 'express';
const router = express.Router();
const mongoose = require('mongoose');

const sgMail = require('@sendgrid/mail');
const { emailVerificationTemplate,
    promotionTemplate, generateEmailList } = require('../models/mail');
const { validateEmailVerification,
    validatePromotionEmail,
    validatePromotion, Promotion, Email, Sms, validateSms } = require('../models/promotion');
const {auth} = require('../middleware/auth');


// send email to verify user email
router.post('/sendMailVerification', async (req, res) => {


    // validate user input
    const { error } = validateEmailVerification(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        //console.log(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: req.body.to,
            from: 'b2b@b2b.com',
            subject: 'Email Verification',
            html: emailVerificationTemplate(req.body.username)
        };

        const sent = await sgMail.send(msg);
        if (sent) {
            res.status(200).send({ message: 'email sent successfully' })
        }
    } catch (error) {
        res.status(400).send(new Error(error.message))
    }

});

// send email
// router.post('/email', async (req, res) => {


//     // validate user input
//     const { error } = validatePromotionEmail(req.body);
//     if (error) return res.status(400).send(error.details[0].message);


//     try {
//         //console.log(process.env.SENDGRID_API_KEY);
//         sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//         const msg = {
//             to: req.body.to,
//             from: 'b2b@b2b.com',
//             subject: req.body.subject,
//             html: promotionTemplate(
//                 req.body.username,
//                 req.body.intro,
//                 req.body.instructions,
//                 req.body.buttonText,
//                 req.body.buttonLink
//             )
//         };

//         const sent = await sgMail.send(msg);
//         if (sent) {

//             const email = new Email({
//                 sender: req.body.sender,
//                 recipients: req.body.recipients,
//                 to: req.body.to,
//                 subject: req.body.subject,
//                 username: req.body.username,
//                 intro: req.body.intro,
//                 instructions: req.body.instructions,
//                 buttonText: req.body.buttonText,
//                 buttonLink: req.body.buttonLink


//             });
//             await email.save();

//             res.send(email);
//             // res.status(200).send({ message: 'email sent successfully' })
//         }
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(new Error(error.message))
//     }

// });



// send email
router.post('/email/:id', auth, async (req: any, res) => {


    console.log('in backend send mail');

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid Id.');
    }

    const email = await Email.findById(req.params.id);


    if (!email) return res.status(404).send('An email with the given id doesn\'t exist');


    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        console.log(req.body.subscribers);
        const emails = generateEmailList(req.body.subscribers, email);

        console.log(email);


        // const msg = {
        //     to: req.body.to,
        //     from: 'b2b@b2b.com',
        //     subject: req.body.subject,
        //     html: promotionTemplate(
        //         req.body.username,
        //         req.body.intro,
        //         req.body.instructions,
        //         req.body.buttonText,
        //         req.body.buttonLink
        //     )
        // };

        console.log(emails);

        const sent = await sgMail.send(emails);
        res.status(200).send(sent);
    } catch (error) {
        console.log(error.response.body.errors);
        res.status(400).send(new Error(error.response.body.errors))
    }
});



// create email
router.post('/email', auth, async (req, res) => {
    const { error } = validatePromotionEmail(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const email = new Email({
        sender: req.body.sender,
        recipients: req.body.recipients, // empty
        to: req.body.to,                 // empty
        subject: req.body.subject,
        username: req.body.username,     // empty
        intro: req.body.intro,
        instructions: req.body.instructions,
        buttonText: req.body.buttonText,
        buttonLink: req.body.buttonLink


    });
    await email.save();

    res.send(email);

})


// get all emails of user
router.get('/email', auth, async (req: any, res) => {
    const emails = await Email.find({
        sender: req.user._id
    });

    // if (!emails) return res.status(200).send('This user has not  sent any emails.');

    res.send(emails);
});


// get a single email
router.get('/email/:id', auth, async (req: any, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid Id.');
    } 

    const email = await Email.findById(req.params.id);

    if (!email) return res.status(200).send('An email with the given id doesn\'t exist');

    res.send(email);
});


// edit an email
router.put('/email/:id', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid Id.');
    }

    const { error } = validatePromotionEmail(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const email = await Email.findByIdAndUpdate(
        req.params.id,
        {
            sender: req.body.sender,
            recipients: req.body.recipients,
            to: req.body.to,
            username: req.body.username,
            subject: req.body.subject,
            intro: req.body.intro,
            instructions: req.body.instructions,
            buttonText: req.body.buttonText,
            buttonLink: req.body.buttonLink

        },
        { new: true }
    );

    if (!email) return res.status(404).send('The email with the given ID was not found.');

    res.send(email);
});




// send sms
router.post('/sms', async (req, res) => {

    const { error } = validateSms(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);


    client.messages
        .create({
            body: req.body.body,
            from: process.env.PHONE_NUMBER,
            to: req.body.to
        })
        .then(async message => {
            console.log(message.sid);

            const sms = new Sms({
                sender: req.body.sender,
                recipients: req.body.recipients,
                to: req.body.to,
                body: req.body.body
            });
            await sms.save();

            res.send(sms);
        }).catch((error) => {
            res.status(400).send(new Error(error.message))
        });
});

module.exports = router;