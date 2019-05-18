// require("../config/config");

// EmailService.js
import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport'

// Configure transport options
const mailgunOptions = {
    auth: {
        api_key: "16c799ad50f469636b15fcfb12d253d7-4a62b8e8-859bb623",
        domain: "sandbox81c1e889e5ed460d8d97442bdfc1fc44.mailgun.org" || "https://gentle-waters-83618.herokuapp.com/",
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