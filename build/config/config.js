"use strict";

let config = require("config");

let env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  let envConfig = config[env];
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}