"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../auth/auth"));

var _check = require("express-validator/check");

var _url = require("../config/url");

var _user = require("../models/user");

var _loan = require("../models/loan");

var _mailer = _interopRequireDefault(require("../misc/mailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isUser = _auth.default.isUser;
const isAdmin = _auth.default.isAdmin;

const router = _express.default.Router(); // router.get('/',  (req, res) => {
//     res.render("index",{
//         title:"LOAN APP"
//     })
// })


router.get('/user_page', isUser, (req, res) => {
  let email = res.locals.user.email; // console.log(res.locals.user)

  _loan.Loan.find({}).then(loanee => {
    _user.User.find({}).then(user => {
      _loan.Loan.findOne({
        email
      }).then(loneLoan => {
        // console.log("all lones",loanee)
        // console.log("single loanAmount",loneLoan)
        res.render("pages/user_page", {
          title: "LOAN APP",
          loan: loanee,
          // transferNumber:"",
          // paymentDate:"",
          // myLoan: "loneLoan.amount",
          users: user
        });
      });
    });
  }, err => {
    console.log(err);
  }); // res.render("pages/user_page", {
  //     title: "LOAN APP"
  // })

});
router.post('/user_page', isUser, [(0, _check.check)('loanType').isString(), (0, _check.check)('reason').isString(), (0, _check.check)('street').isString(), (0, _check.check)('state').isString(), (0, _check.check)('town').isString(), (0, _check.check)('lga').isString(), (0, _check.check)('lived').isString(), (0, _check.check)('bankName').isString(), (0, _check.check)('amount').isNumeric(), (0, _check.check)('bankAcc').isNumeric(), (0, _check.check)('monthIncome').isNumeric()], (req, res) => {
  const {
    amount,
    loanType,
    reason,
    street,
    state,
    town,
    lga,
    lived,
    bankName,
    bankAcc,
    monthIncome
  } = req.body;
  const errors = (0, _check.validationResult)(req);
  const email = req.user.email; // console.log("loanType",loanType)

  if (!errors.isEmpty()) {
    console.log("error");
    req.flash('error', 'Check your details and make sure it is correct');
    res.render("pages/user_page", {
      title: "LOAN APP"
    });
  } else {
    console.log(email);

    _user.User.findOne({
      email
    }).then(user => {
      console.log(user.paid);

      if (user.loanStatus === "pending") {
        console.log("status", user.loanStatus);
      }

      if (user.paid === false && user.loanStatus === "pending") {
        req.flash('error', 'Sorry you already have a pending loan Or you have not paid previous Loan');
        res.redirect("/user_page");
      } else {
        _user.User.findOneAndUpdate({
          email
        }, {
          $set: {
            paid: "false",
            givenLoan: "No"
          }
        }, {
          returnOriginal: false
        }).then(loanee => {}).catch(e => {
          console.log(e);
        });

        let loan = new _loan.Loan({
          amount,
          reason,
          street,
          state,
          town,
          lga,
          lived,
          bankName,
          bankAcc,
          monthIncome,
          loanType,
          loanName: user.fName,
          givenLoan: "No",
          request: "yes",
          email: req.user.email,
          userId: user._id,
          payment: "Not Yet",
          status: "Not Done"
        }); // console.log(loan.reason)

        loan.save().then(loanee => {
          // console.log(loan.reason)
          req.flash('success', 'Good luck, you will be contacted if granted');
          res.redirect("/user_page");

          _user.User.findOneAndUpdate({
            email
          }, {
            $set: {
              loanStatus: "pending",
              paid: false
            }
          }, {
            returnOriginal: false
          }).then(user => {// console.log(user)
          }).catch(e => {
            console.log(e);
          });
        }).catch(e => {
          console.log(e);
        });
        let userId = req.user._id;
        const html = `<h1>Hi Admin</h1>,
                                <br/><h2>Loan Request,</h2>
                                <br/>
                                please check and confirm payment for a pending loan request from ${req.user.email};
                                on the following page:
                                <a href="${_url.url}admin/confirm/${userId}">${_url.url}admin/confirm/${userId}</a>
                                <br/><br/>`;

        _user.User.findOne({
          admin: 1
        }).then(user => {
          // console.log("adminUser", user)
          // console.log("UserID", userId)
          // console.log("adminUserEmail",user.email)
          // console.log(`${url}admin/confirm/${userId}`)
          _mailer.default.sendText(user.email, 'Please confirm Loan request', html).then(() => {
            console.log("message success");
          }).catch(e => {
            console.log("message error", e);
          });
        });
      }
    }).catch(e => {
      console.log(e);
    });
  } // res.render("pages/user_page", {
  //     title: "LOAN APP"
  // })

});
router.get('/admin/confirm/:id', isUser, (req, res) => {
  let id = req.params.id; // console.log("confirmID",id)

  _user.User.findById({
    _id: id
  }).then(user => {
    if (!user) {
      req.flash('error', 'We are here');
      res.redirect("/");
    } else {
      let email = user.email;

      _loan.Loan.findOne({
        email
      }).then(loanee => {
        // console.log("loanType", loanee.loanType)
        res.render("pages/confirm", {
          title: "LOAN Confirmation",
          id: req.params.id,
          amount: loanee.amount,
          loanType: loanee.loanType,
          reason: loanee.reason,
          street: loanee.street,
          state: loanee.state,
          town: loanee.town,
          lga: loanee.lga,
          lived: loanee.lived,
          bankName: loanee.bankName,
          bankAcc: loanee.bankAcc,
          monthIncome: loanee.monthIncome
        });
      });
    }
  }).catch(e => {
    console.log(e);
    req.flash('error', 'We are here');
    res.redirect("/");
  });
});
router.post('/admin/unconfirm/:id', isUser, (req, res) => {
  let id = req.params.id; // console.log("confirmID",id)

  _user.User.findById({
    _id: id
  }).then(user => {
    let userName = user.fName;
    let userEmail = user.email; // console.log("userName", userName)
    // console.log("userEmail", userEmail)

    if (!user) {
      req.flash('error', 'We are here');
      res.redirect("/");
    } else {
      _loan.Loan.find({
        email: userEmail
      }).then(loan => {
        // console.log(loan.givenLoan)
        loan.forEach(loanee => {
          if (loanee.givenLoan === "No") {
            let _id = loanee._id; // console.log("are you the id", _id)

            _loan.Loan.findOneAndDelete({
              _id
            }).then(loanee => {
              console.log("deleted", loanee);
            }).catch(e => {
              console.log(e);
            });
          }
        });
      }).catch(e => {
        console.log(e);
      });

      _user.User.findOneAndUpdate({
        email: userEmail
      }, {
        $set: {
          loanStatus: "unpending"
        }
      }, {
        returnOriginal: false
      }).then(user => {// console.log(user)
      }).catch(e => {
        console.log(e);
      });

      let loanGrant1 = `<h1>Hi ${userName}</h1>,
                                <br/><h2>Your Loan is not granted,</h2>
                                <br/>
                                We are sorry we could not grant your loan this time:
                                <br/>
                                Make another request so we may grant it
                                <br/><br/>`;

      _mailer.default.sendText(userEmail, 'Reminisce Loan', loanGrant1).then(() => {
        console.log("message success");
      }).catch(e => {
        console.log("message error", e);
      });

      req.flash('success', 'The User will be Informed of your Action');
      res.redirect("/user_page");
    }
  }).catch(e => {
    console.log(e);
  });
});
router.post('/admin/confirm/:id', isUser, (req, res) => {
  let id = req.params.id;

  _user.User.findById({
    _id: id
  }).then(user => {
    // console.log("users to confirm",user)
    let userName = user.fName;
    let userEmail = user.email;

    if (!user) {
      req.flash('error', 'We are here');
      res.redirect("/");
    } else {
      console.log(userEmail);

      _loan.Loan.find({
        email: userEmail
      }).then(loan => {
        // console.log(loan.givenLoan)
        loan.forEach(loanee => {
          if (loanee.givenLoan === "No") {
            let _id = loanee._id; // console.log("are you the id", _id)

            _loan.Loan.findByIdAndUpdate({
              _id
            }, {
              $set: {
                givenLoan: "Yes"
              }
            }, {
              returnOriginal: false
            }).then(loanee => {// console.log(loanee)
            }).catch(e => {
              console.log(e);
            });
          }
        });
      }).catch(e => {
        console.log(e);
      });

      _user.User.findOneAndUpdate({
        email: userEmail
      }, {
        $set: {
          givenLoan: "Yes",
          loanStatus: "pending",
          paid: false
        }
      }, {
        returnOriginal: false
      }).then(user => {// console.log(user)
      }).catch(e => {
        console.log(e);
      }); // console.log("sendMessage to",userName)


      let loanGrant2 = `<h1>Hi ${userName}</h1>,
                                <br/><h2>Your Loan is granted,</h2>
                                <br/>
                                please login to your profile and pay once you are ready;
                                Dont forget to tell your friends we are for real:
                                <br/>
                                Pay back in time to get loan quickly
                                <br/><br/>`;

      _mailer.default.sendText(userEmail, 'Loan Granted', loanGrant2).then(() => {
        console.log("message success");
      }).catch(e => {
        console.log("message error", e);
      });

      console.log("loan granted");
      req.flash("success", "The loanee will be paid immediately");
      res.redirect("/user_page");
    }
  });
});
router.post('/user/pay', isUser, [(0, _check.check)('transferNumber').isString(), (0, _check.check)('paymentDate').isString()], (req, res) => {
  const {
    transferNumber,
    paymentDate
  } = req.body;
  const errors = (0, _check.validationResult)(req);
  let userEmail = req.user.email;
  console.log(userEmail);

  if (!errors.isEmpty()) {
    console.log("error");
    req.flash('error', 'Check your details and make sure it is correct');
    res.render("pages/user_page", {
      title: "LOAN APP"
    });
  } else {
    let userId = req.user._id;
    console.log(userId);
    const html = `<h1>Hi Admin</h1>,
                                <br/><h2>Loan Request,</h2>
                                <br/>
                                please check and confirm payment of a loan request from ${req.user.email};
                                on the following page:
                                <a href="${_url.url}admin/payment_confirmation/${userId}">${_url.url}admin/payment_confirmation/${userId}</a>
                                <br/><br/>`;

    _user.User.findOne({
      admin: 1
    }).then(user => {
      console.log(user.email);

      _mailer.default.sendText(user.email, 'Please confirm Payment request', html).then(() => {
        console.log("message success");
      }).catch(e => {
        console.log("message error", e);
      });
    });

    _loan.Loan.find({
      email: userEmail
    }).then(loan => {
      loan.forEach(loanee => {
        if (loanee.payment === "Not Yet") {
          let _id = loanee._id;

          _loan.Loan.findByIdAndUpdate({
            _id
          }, {
            $set: {
              transferNumber,
              paymentDate
            }
          }, {
            returnOriginal: false
          }).then(loanee => {}).catch(e => {
            console.log(e);
          });
        }
      });
    }).catch(e => {
      console.log(e);
    }); // Loan.findOneAndUpdate({ email: userEmail }, {
    //     $set: { transferNumber, paymentDate }
    // },
    //     { returnOriginal: false }).then((loanee) => {
    //         // console.log(loanee)
    //     }).catch(e => {
    //         console.log(e);
    //     })

  }

  req.flash('success', 'An agent will get to you to confirm your payment');
  res.redirect("/user_page");
});
router.get('/admin/payment_confirmation/:id', isUser, (req, res) => {
  let id = req.params.id; // let id = req.params.id
  // console.log("confirmID",id)

  _user.User.findById({
    _id: id
  }).then(user => {
    if (!user) {
      req.flash('error', 'We are here');
      res.redirect("/");
    } else {
      let email = user.email;

      _loan.Loan.findOne({
        email
      }).then(loanee => {
        res.render("pages/payment", {
          title: "LOAN APP",
          transferNumber: loanee.transferNumber,
          paymentDate: loanee.paymentDate,
          id: loanee.userId
        });
      }).catch(e => console.log(e));
    }
  });
});
router.post('/admin/payment_confirmation/:id', isUser, [(0, _check.check)('transferNumber').isString()], (req, res) => {
  const {
    transferNumber,
    paymentDate
  } = req.body;
  const errors = (0, _check.validationResult)(req);
  let id = req.params.id; // let userEmail = req.user.email;
  // let userName = req.user.fName;

  if (!errors.isEmpty()) {
    console.log("error");
    req.flash('error', 'Check your details and make sure it is correct');
    res.render("pages/user_page", {
      title: "LOAN APP"
    });
  } else {
    _user.User.findOne({
      _id: id
    }).then(user => {
      let userName = user.fName;
      let userEmail = user.email;
      let loanPayment = `<h1>Hi ${userName}</h1>,
                                <br/><h2>Your Loan payment has been confirmed,</h2>
                                <br/>
                                please login to your profile and make more loan request;
                                Dont forget to tell your friends we are for real:
                                <br/>
                                Thank You so much
                                <br/><br/>`;

      _mailer.default.sendText(userEmail, 'Loan Granted', loanPayment).then(() => {
        console.log("message success");
      }).catch(e => {
        console.log("message error", e);
      });

      _loan.Loan.find({
        email: userEmail
      }).then(loan => {
        loan.forEach(loanee => {
          if (loanee.payment === "Not Yet") {
            let _id = loanee._id;

            _loan.Loan.findByIdAndUpdate({
              _id
            }, {
              $set: {
                transferNumber,
                paymentDate,
                status: "Done",
                payment: "PAID",
                accepted: "yes"
              }
            }, {
              returnOriginal: false
            }).then(loanee => {}).catch(e => {
              console.log(e);
            });
          }
        });
      }).catch(e => {
        console.log(e);
      });

      _user.User.findOneAndUpdate({
        email: userEmail
      }, {
        $set: {
          givenLoan: "No",
          paid: true,
          loanStatus: "unpending"
        }
      }, {
        returnOriginal: false
      }).then(loanee => {// console.log(loanee)
      }).catch(e => {
        console.log(e);
      });

      req.flash('success', 'payment confirmed');
      res.redirect("/user_page");
    }).catch(e => {
      console.log(e);
    });
  }
});
router.post('/admin/unpayment_confirmation/:id', isUser, [(0, _check.check)('transferNumber').isString()], (req, res) => {
  const {
    transferNumber,
    paymentDate
  } = req.body;
  const errors = (0, _check.validationResult)(req);
  let userEmail = req.user.email;
  let userName = req.user.fName;
  let id = req.params.id;

  if (!errors.isEmpty()) {
    console.log("error");
    req.flash('error', 'Check your details and make sure it is correct');
    res.render("pages/user_page", {
      title: "LOAN APP"
    });
  } else {
    _user.User.findOne({
      _id: id
    }).then(user => {
      let userName = user.fName;
      let userEmail = user.email;
      let loanPayment = `<h1>Hi ${userName}</h1>,
                                <br/><h2>Your Loan payment is not confirmed,</h2>
                                <br/>
                                please login to your profile and pay once you are ready;
                                Dont forget to tell your friends we are for real:
                                <br/>
                                Pay back in time to get loan quickly
                                <br/><br/>`;

      _mailer.default.sendText(userEmail, 'Loan Granted Payment', loanPayment).then(() => {
        console.log("message success");
      }).catch(e => {
        console.log("message error", e);
      });

      _loan.Loan.find({
        email: userEmail
      }).then(loan => {
        loan.forEach(loanee => {
          if (loanee.payment === "Not Yet") {
            let _id = loanee._id;

            _loan.Loan.findByIdAndUpdate({
              _id
            }, {
              $set: {
                transferNumber: "",
                paymentDate: ""
              }
            }, {
              returnOriginal: false
            }).then(loanee => {}).catch(e => {
              console.log(e);
            });
          }
        });
      }).catch(e => {
        console.log(e);
      }); // Loan.findOneAndUpdate({ email: userEmail }, {
      //     $set: { transferNumber:"", paymentDate:"", }
      // },
      //     { returnOriginal: false }).then((loanee) => {
      //         // console.log(loanee)
      //     }).catch(e => {
      //         console.log(e);
      //     })


      req.flash('success', 'we will inform the loanee');
      res.redirect("/user_page");
    }).catch(e => {
      console.log(e);
    }); // Loan.findOneAndUpdate({ email: userEmail }, {
    //     $set: { transferNumber, paymentDate, payment: "PAID" }
    // },
    //     { returnOriginal: false }).then((loanee) => {
    //         // console.log(loanee)
    //     }).catch(e => {
    //         console.log(e);
    //     })
    // User.findOneAndUpdate({ email: userEmail }, {
    //     $set: { paid: true, loanStatus: "unpending" }
    // },
    //     { returnOriginal: false }).then((loanee) => {
    //         // console.log(loanee)
    //     }).catch(e => {
    //         console.log(e);
    //     }) 

  }
});
var _default = router;
exports.default = _default;