const MailGen = require('mailgen')


function emailVerificationTemplate(username) {
    const mailGenerator = new MailGen({
        theme: 'cerberus',
        product: {
            name: 'Business to Business Ecommerce',
            link: 'http://example.com',
            // logo: your app logo url
        },
    })

    const email = {
        body: {
            name: username,
            intro: 'Welcome to email verification',
            action: {
                instructions: 'Please click the button below to verify your account',
                button: {
                    color: '#33b5e5',
                    text: 'Verify account',
                    link: 'http://example.com/verify_account',
                },
            },
        },
    }

    const emailTemplate = mailGenerator.generate(email)
    //require('fs').writeFileSync('preview.html', emailTemplate, 'utf8')

    return emailTemplate;

}

function orderStatusTemplate(username, orderNumber) {
    const mailGenerator = new MailGen({
        theme: 'cerberus',
        product: {
            name: 'Business to Business Ecommerce',
            link: 'http://example.com',
            // logo: your app logo url
        },
    })

    const email = {
        body: {
            name: username,
            intro: `The status of order #${orderNumber} has been changed.`,
            action: {
                instructions: 'You can review your order in the dashboard',
                button: {
                    color: 'blue',
                    text: 'Go to Dashboard',
                    link: 'http://example.com',
                },
            },
        },
    }

    const emailTemplate = mailGenerator.generate(email)
    //require('fs').writeFileSync('preview.html', emailTemplate, 'utf8')

    return emailTemplate;

}


function promotionTemplate(username,  intro, instructions, buttonText, buttonLink ) {
    const mailGenerator = new MailGen({
        theme: 'cerberus',
        product: {
            name: 'Business to Business Ecommerce',
            link: 'http://example.com',
            // logo: your app logo url
        },
    })

    const email = {
        body: {
            name: username,
            intro: intro,
            action: {
                instructions: instructions,
                button: {
                    color: '#33b5e5',
                    text: buttonText,
                    link: buttonLink,
                },
            },
        },
    }

    const emailTemplate = mailGenerator.generate(email)
    //require('fs').writeFileSync('preview.html', emailTemplate, 'utf8')

    return emailTemplate;

}


function generateEmailList(subscribers, email) {
    let emails = [];
    subscribers.forEach(subscriber => {

            emails.push({
                to: subscriber.email,
                from: 'tungat72@gmail.com', // because gmail requires you to verify single sender
                subject: email.subject,
                html: promotionTemplate(
                    subscriber.firstName,
                    email.intro,
                    email.instructions,
                    email.buttonText,
                    email.buttonLink
                )
            });
        
    });

    return emails;
}

// write performa template




exports.emailVerificationTemplate = emailVerificationTemplate;
exports.orderStatusTemplate = orderStatusTemplate;
exports.promotionTemplate = promotionTemplate;
exports.generateEmailList = generateEmailList;