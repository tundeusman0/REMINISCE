"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    default: "password"
  },
  admin: {
    type: Number
  },
  fName: {
    type: String
  },
  lName: {
    type: String
  },
  bvn: {
    type: String
  },
  num: {
    type: Number
  },
  gender: {
    type: String
  },
  agree: {
    type: String
  },
  secretToken: {
    type: String
  },
  active: {
    type: Boolean
  },
  loanStatus: {
    type: String
  },
  paid: {
    type: Boolean
  }
}); // UsersSchema.methods.setPassword = function (password) {
//     this.salt = crypto.randomBytes(16).toString('hex');
//     this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
// };
// UsersSchema.methods.validatePassword = function (password) {
//     const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
//     return this.hash === hash;
// };
// UsersSchema.methods.generateJWT = function () {
//     const today = new Date();
//     const expirationDate = new Date(today);
//     expirationDate.setDate(today.getDate() + 60);
//     return jwt.sign({
//         email: this.email,
//         id: this._id,
//         exp: parseInt(expirationDate.getTime() / 1000, 10),
//     }, 'secret');
// }
// UsersSchema.methods.toAuthJSON = function () {
//     return {
//         _id: this._id,
//         email: this.email,
//         token: this.generateJWT(),
//     };
// };

let User = mongoose.model('User', UserSchema);
module.exports = {
  User
};