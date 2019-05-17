const LocalStrategy = require('passport-local').Strategy;
import {mongoose} from "../db/mongoose"
import bcrypt from "bcryptjs"
import {User} from "../models/user"

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            (email, password, done) => {
                User.findOne({ email }).then(user => {
                    if (!user) {
                        return done(null, false, { message: 'this email is not registerd' })
                    }
                    if(!user.active){
                        return done(null, false, { message: 'Please go to your mail and verify' })
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        // console.log(isMatch)
                        if (err) throw err;
                        if (isMatch) {
                            // console.log(isMatch)
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'password incorrect' })
                        }
                    })
                }).catch((e) => console.log(e))
            })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // passport.deserializeUser(function (user, done) {
    //     done(null, user);
    // });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
            // console.log(user)
        });
    });

}

