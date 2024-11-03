const { Recipient, EmailParams, MailerSend,Sender } = require("mailersend");
const dotenv = require("dotenv");
dotenv.config();

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

const sentFrom = new Sender(process.env.MAILERFROM_EMAIL, "Ticket Master");


const sendMail = async ({ to, subject, html, text }) => {
    console.log("subject:",subject,"to:",to,"text:",text);
    try {
        const recipients = [new Recipient(to, "Recipient")];
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setReplyTo(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setHtml(html)
            .setText(text);

         await mailerSend.email.send(emailParams);
       
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};

module.exports = { sendMail };
