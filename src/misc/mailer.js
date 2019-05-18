// require("../config/config");

// EmailService.js
import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport'
// https://api.mailgun.net/v3/gentle-waters-83618.herokuapp.com
// '"Reminisce" <youremail@{yourdomain.com}>'
// "https://api:#{API_KEY}@api.mailgun.net/v2/<your-mailgun-domain>"

// Configure transport options
const mailgunOptions = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: `https://api:${process.env.MAILGUN_API_KEY}@api.mailgun.net/v2/${process.env.MAILGUN_DOMAIN}`,
    }
}
console.log(mailgunOptions.auth.domain)
const transport = mailgunTransport(mailgunOptions)
// EmailService
class EmailService {
    constructor() {
        this.emailClient = nodemailer.createTransport(transport)
    }
    sendText(to, subject, html) {
        return new Promise((resolve, reject) => {
            this.emailClient.sendMail({
                from: '"Reminisce" <youremail@{yourdomain.com}>',
                to,
                subject,
                html,
            }, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })
    }
}
export default new EmailService()
// module.exports = new EmailService()