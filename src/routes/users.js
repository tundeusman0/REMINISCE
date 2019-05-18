import express from "express";
// import { mongoose } from "../db/mongoose";
import { User } from '../models/user';
import { check, validationResult } from "express-validator/check";
import cryptoRandomString from 'crypto-random-string';
import passport from "passport";
import bcrypt from "bcryptjs"

import auth from "../auth/auth";
import EmailService from "../misc/mailer";

import url from "../config/url";

const isUser = auth.isUser;

const router = express.Router();

// router.get('/', (req, res) => {
//     res.render("index")
// })
router.get('/register', (req, res) => {
    const { email, fName, lName, bvn, num } = req.body;
    res.render("pages/register.ejs", {
        email, fName, lName, bvn, num,
        title: "Registration Page"
    })
})
router.post('/register', [
    check('email').isEmail(),
    check('fName').isString(),
    check('lName').isString(),
    check('num').isNumeric(),
    check('gender').isString(),

], (req, res) => {
    const { email, password, password2, fName, lName, bvn, num, gender, agree } = req.body
    const errors = validationResult(req);
    const secretTokens = cryptoRandomString({ length: 10, type: 'base64' });
    if (!errors.isEmpty()) {
        console.log("error")
        req.flash('error', 'Check your details and make sure it is correct');
        res.render('pages/register', {
            errors: errors.array(), email, fName, lName, bvn, num
        })
    } else {
        if (password !== password2) {
            req.flash('error', 'password do not match');
            res.render('pages/register', {
                errors: errors.array(), email, fName, lName, bvn, num
            })
        } else {
            User.findOne({ email }).then(user => {
                if (user) {
                    req.flash('error', 'user already exists');
                    res.render('pages/register', {
                        errors: errors.array(), email, fName, lName, bvn, num
                    })
                } else {

                    let secretToken, active;
                    let user = new User({
                        email, password, fName,
                        lName, bvn, num, gender, agree, secretToken, active, admin: 0,loanStatus:"unpending"
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            user.secretToken = secretTokens
                            user.active = false
                            user.password = hash;
                            user.save().then((user) => {
                                console.log(`user added`)
                                
                                req.flash('info', 
                                'Registration successful, an Email as been sent to you please confirm to be able to login');
                                // res.redirect("/user/register")
                                res.render('pages/register', {
                                    email:"", fName:"", lName:"", bvn:"", num:""
                                })

                            }).catch((e) => {
                                req.flash('error', "duplicate email")
                                console.log(e)
                                res.render('pages/register', {
                                    errors: errors.array(), email, fName, lName, bvn, num
                                })
                            })

                            const html = `<h1>Hi ${user.fName}</h1>,
                                <br/><h2>Thanks for registering,</h2>
                                <br/>
                                please verify your email by typing the following email token;
                                Token: <h3><b>${secretTokens}</b></h3>
                                on the following page:
                                <a href="${url}user/verify">${url}user/verify</a>
                                <br/><br/>`
                            console.log("send to",email)
                            EmailService.sendText(email, 'Please Verify Your Email!', html)
                                .then(() => {
                                    console.log("message success",email)
                                })
                                .catch((e) => {
                                    console.log("message error",e)
                                })
                            
                        })
                    })

                }
            }).catch(e => {
                console.log(e)
            })

        }
    }

})

// Get Login
router.get('/login', (req, res) => {
    // if (res.locals.user) res.redirect('/');
    res.render("pages/login.ejs", {
        title:"Log In"
    })
})

router.get('/verify', (req, res) => {
    res.render("pages/verify.ejs", {
        title: "Verify Page"
    })
})
router.post('/verify', function (req, res, next) {

    const { secretToken } = req.body
    User.findOne({secretToken}).then(user=>{
        if(user.secretToken === secretToken && user.active === true){
            req.flash('error', "you are already verified")
            res.render('pages/verify')
        } else if (user.secretToken === secretToken){
            user.active = true;
            user.save().then(userUpdate=>{
                // console.log(userUpdate)
                req.flash('message', "you are updated please login into your account")
                res.render('pages/login')
            }).catch(e=>{
                console.log(e)
                req.flash('error', "Something went wrong")
                res.render('pages/verify')
            })

        }else{
            req.flash('error', "you are already verified")
            res.render('pages/verify')
        }
    }).catch(e=>{
        console.log(e)
        req.flash('error', "you are not a user please register and come back to verify your mail")
        res.render('pages/verify')
    })

});
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/user_page',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);

});

router.get('/logout', function (req, res) {

    // req.
    req.logout();

    req.flash('success', 'You are logged out!');
    // res.redirect('/user/login');
    res.render('pages/login.ejs',{
        title: "Log In Page"
    });

});

export default router