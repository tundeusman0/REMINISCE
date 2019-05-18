import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";

// require("./config/config");
// import("./config/config");
let MongoStore = require('connect-mongo')(session);


import path from "path";

import pages from "./routes/pages";
import register from "./routes/users";


const app = express();
const port = process.env.PORT || 3000
// process.env.NODE_ENV

// bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json({
    type: function (req) {
        return req.get('content-type').indexOf('multipart/form-data') !== 0;
    },
}));

// express session
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true, store: new MongoStore(options) }));
app.use(passport.initialize());
app.use(passport.session());

// passport config
require("./auth/passport")(passport)

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

const viewPath = path.join(__dirname, '/../views')
const publicPath = path.join(__dirname, '/../public')

// set view engine
app.set('view engine', 'ejs')
app.set('views', viewPath)
// public files
app.use(express.static(publicPath))

app.locals.errors = null;




app.get('/', (req, res) => {
    res.render("index", {
        title: "LOAN APP"
    })
})

app.get("*", function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use("/", pages);

app.use("/user", register);

app.listen(port, () => {
    console.log(`app started at port ${port}`)
})