"use strict";

var _mongoose = require("../db/mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _user = require("../models/user");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
    _user.User.findOne({
      email
    }).then(user => {
      if (!user) {
        return done(null, false, {
          message: 'this email is not registerd'
        });
      }

      if (!user.active) {
        return done(null, false, {
          message: 'Please go to your mail and verify'
        });
      }

      _bcryptjs.default.compare(password, user.password, (err, isMatch) => {
        // console.log(isMatch)
        if (err) throw err;

        if (isMatch) {
          // console.log(isMatch)
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'password incorrect'
          });
        }
      });
    }).catch(e => console.log(e));
  }));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  }); // passport.deserializeUser(function (user, done) {
  //     done(null, user);
  // });

  passport.deserializeUser(function (id, done) {
    _user.User.findById(id, function (err, user) {
      done(err, user); // console.log(user)
    });
  });
};