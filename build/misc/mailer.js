"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../config/config");

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _nodemailerMailgunTransport = _interopRequireDefault(require("nodemailer-mailgun-transport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// EmailService.js
// Configure transport options
const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};
const transport = (0, _nodemailerMailgunTransport.default)(mailgunOptions); // EmailService

class EmailService {
  constructor() {
    this.emailClient = _nodemailer.default.createTransport(transport);
  }

  sendText(to, subject, html) {
    return new Promise((resolve, reject) => {
      this.emailClient.sendMail({
        from: '"Reminisce" <youremail@yourdomain.com>',
        to,
        subject,
        html
      }, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }

}

var _default = new EmailService();

exports.default = _default;