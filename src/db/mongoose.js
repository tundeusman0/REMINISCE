const mongoose = require('mongoose')
// require("./config/config");

mongoose.Promise = global.Promise
mongoose.set('useFindAndModify', false)

mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
})

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(`we're connected! to mongoDB`)
});

module.exports = { mongoose }