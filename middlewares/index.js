const loginMiddleware = require("./loginMiddleware");
const logoutMiddleware = require("./logoutMiddleware");
const meMiddleware = require("./meMiddleware");

module.exports = {
  loginMiddleware: loginMiddleware,
  logoutMiddleware: logoutMiddleware,
  meMiddleware: meMiddleware,
};
