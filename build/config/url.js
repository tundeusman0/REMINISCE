"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.url = void 0;
const production = 'https://gentle-waters-83618.herokuapp.com/';
const development = 'http://localhost:3000/';
const url = process.env.NODE_ENV ? production : development;
exports.url = url;