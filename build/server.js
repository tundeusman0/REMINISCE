"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _pages = _interopRequireDefault(require("./routes/pages"));

var _users = _interopRequireDefault(require("./routes/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("./config/config"); // import("./config/config");


let MongoStore = require('connect-mongo')(_expressSession.default);

const app = (0, _express.default)();
const port = process.env.PORT; // process.env.NODE_ENV
// bodyParser
// parse application/x-www-form-urlencoded

app.use(_bodyParser.default.urlencoded({
  extended: false
})); // parse application/json

app.use(_bodyParser.default.json({
  type: function (req) {
    return req.get('content-type').indexOf('multipart/form-data') !== 0;
  }
})); // express session

app.use((0, _expressSession.default)({
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true
}));
app.use(_passport.default.initialize());
app.use(_passport.default.session()); // passport config

require("./auth/passport")(_passport.default); // passport middleware


app.use(_passport.default.initialize());
app.use(_passport.default.session()); // express-messages middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

const viewPath = _path.default.join(__dirname, '/../views');

const publicPath = _path.default.join(__dirname, '/../public'); // set view engine


app.set('view engine', 'ejs');
app.set('views', viewPath); // public files

app.use(_express.default.static(publicPath));
app.locals.errors = null;
app.get('/', (req, res) => {
  res.render("index", {
    title: "LOAN APP"
  });
});
app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
app.use("/", _pages.default);
app.use("/user", _users.default);
app.listen(port, () => {
  console.log(`app started at port ${port}`);
});