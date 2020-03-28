import express from 'express';
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const { emailVerificationTemplate,
    promotionTemplate } = require('../models/mail');
const { validateEmailVerification,
    validatePromotionEmail } = require('../models/promotion');

//require('dotenv').config()

router.post('/sendMailVerification', async (req, res) => {


    // validate user input
    const { error } = validateEmailVerification(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        //console.log(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: req.body.to,
            from: 'b2b@noreply.com',
            subject: 'Email Verification',
            html: emailVerificationTemplate(req.body.username)
        };

        const sent = await sgMail.send(msg);
        if (sent) {
            res.send({ message: 'email sent successfully' })
        }
    } catch (error) {
        res.send(new Error(error.message))
    }

});


router.post('/promotionEmail', async (req, res) => {


    // validate user input
    const { error } = validatePromotionEmail(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        //console.log(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: req.body.to,
            from: 'noreply@b2b.com',
            subject: req.body.subject,
            html: promotionTemplate(
                req.body.username,
                req.body.intro,
                req.body.instructions,
                req.body.buttonText,
                req.body.buttonLink
            )
        };

        const sent = await sgMail.send(msg);
        if (sent) {
            res.send({ message: 'email sent successfully' })
        }
    } catch (error) {
        res.send(new Error(error.message))
    }

});



router.post('/promotionSMS', async (req, res) => {

    const accountSid = 'AC0b543878479732e7bff2182e204aaeee';
    const authToken = '662d4e603dafd6543148b04624a06135';
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
            from: '+12018014296',
            to: '+251923072072'
        })
        .then(message => {
            console.log(message.sid);
            res.send(message);
        });



});


module.exports = router;