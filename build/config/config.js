"use strict";

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  let envConfig = _config.default[env];
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}