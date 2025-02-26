const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: '7ebf37001@smtp-brevo.com',
        pass: 'ZkgdjcGbwTS8UD0f',
    },
    secure: false, // Use TLS
});

const sendMail = async ({ to, subject, html, text }) => {
    try {
        const mailOptions = {
            from: process.env.MAILER_FROM_EMAIL || 'ticketdenewale.com@gmail.com', // Use your verified sender email here
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email');
    }
};

module.exports = { sendMail };
