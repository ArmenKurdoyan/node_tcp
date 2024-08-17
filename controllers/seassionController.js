const models = require("../models");
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Controller = require("./controller");
const formatDate = require("../utils/dateFormat");

const saltRounds = 10;
require("dotenv").config();

class SeassionController extends Controller {
  async me(req, res) {
    try {
      const userToken = req.headers.token;

      const decoder = util.promisify(jwt.verify);
      const privateKey = fs.readFileSync("./jwtRS256.key", "utf8");

      const user = await decoder(userToken, privateKey);
      res.status(200);
      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        expDate: formatDate(user.exp),
      });
    } catch (error) {
      console.error(error);
      res.status(401);
      res.json({ error: error });
    }

    return res;
  }

  async login(req, res) {
    try {
      const body = req.parseBody();
      const user = await models.sequelize.models.User.findAll({
        where: {
          login: body.login,
        },
      });
      const pass = user[0].dataValues.password;
      const compare = util.promisify(bcrypt.compare);
      const result = await compare(body.password, pass);

      if (result) {
        const privateKey = fs.readFileSync("./jwtRS256.key", "utf8");
        const jwtSign = util.promisify(jwt.sign);

        const token = await jwtSign(user[0].dataValues, privateKey, {
          algorithm: "RS256",
          expiresIn: "1h",
        });

        res.status(200);
        res.setHeader("token", token);
        res.json({ message: token });
      } else {
        res.status(401);
        res.json({ message: err });
      }
    } catch (error) {
      console.error(error);
      res.status(418);
      res.json({ error: error });
    }

    return res;
  }

  async logout(req, res) {
    try {
      res.status(200);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500);
      res.json({ error: error.message });
    }
    return res;
  }

  register(req, res) {
    try {
      const body = req.parseBody();
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(body.password, salt, function (err, hash) {
          models.sequelize.models.User.create({
            firstName: body.firstname,
            lastName: body.lastname,
            login: body.login,
            password: hash,
          });
        });
      });

      res.status(201);
      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(418);
      res.json({ error: error });
    }

    return res;
  }
}

module.exports = new SeassionController();
