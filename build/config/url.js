"use strict";

const production = 'https://examplePage.com';
const development = 'http://localhost:3000/';
exports.url = process.env.NODE_ENV ? production : development;