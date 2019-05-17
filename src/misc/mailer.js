require("../config/config");

// EmailService.js
import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport'

// Configure transport options
const mailgunOptions = {
    auth: {
        api_key: process.env.api_key,
        domain: process.env.domain,
    }
}
const transport = mailgunTransport(mailgunOptions)
// EmailService
class EmailService {
    constructor() {
        this.emailClient = nodemailer.createTransport(transport)
    }
    sendText(to, subject, html) {
        return new Promise((resolve, reject) => {
            this.emailClient.sendMail({
                from: '"Reminisce" <youremail@yourdomain.com>',
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