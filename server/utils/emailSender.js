const nodemailer = require('nodemailer');

const sendEmailConfirmation = async (name, email, confirmationCode) => {
    try {
        const transporter = nodemailer.createTransport({
            // host: process.env.HOST,
            service: process.env.EMAILSERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAILUSER,
                pass: process.env.EMAILPASS,
            },
        });

        await transporter.sendMail({
            from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`,
            to: email,
            subject: `Email Confirmation For ${process.env.APP_NAME}`,
            html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=${process.env.CLIENT_URL}/verify/${confirmationCode}> Click here</a>
            </div>`,
        });
        console.log('email sent sucessfully');
        return true;
    } catch (error) {
        console.log('email not sent');
        console.log(error);
        return error;
    }
};

module.exports = { sendEmailConfirmation };
