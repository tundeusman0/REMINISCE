const production = 'https://gentle-waters-83618.herokuapp.com/';
const development = 'http://localhost:3000/';

exports.url = (process.env.NODE_ENV ? production : development);