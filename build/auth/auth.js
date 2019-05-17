"use strict";

exports.isUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'Please log in.'); // res.redirect('/user/login');

    res.render('pages/login');
  }
};

exports.isAdmin = function (req, res, next) {
  console.log(res.locals.user.admin);

  if (req.isAuthenticated() && res.locals.user.admin === 1) {
    next();
  } else {
    req.flash('error', 'Please log in as admin.');
    res.redirect('/users/login');
  }
};