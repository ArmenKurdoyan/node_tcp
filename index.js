const Server = require("./server");
const models = require("./models");
const bcrypt = require("bcrypt");
const util = require("util");
const saltRounds = 10;
const server = new Server(process.env.PORT || 3000);

server.post("/timenow", (req, res) => {
  res.json({ time: new Date().toUTCString() });
  return res;
});
server.get("/timenow", (req, res) => {
  console.log(req.headers);
  res.setCookie("a", 10);
  res.setHeader("authorization", "jwt(token)");
  res.json({ time: new Date().toUTCString() });
  return res;
});

server.post("/register", (req, res) => {
  try {
    let user;
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
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(418);
    res.json({ error: error });
  }
  return res;
});

server.post("/login", async (req, res) => {
  try {
    const body = req.parseBody();
    const hash = await models.sequelize.models.User.findAll({
      where: {
        login: body.login,
      },
    });
    const pass = hash[0].dataValues.password;
    const compare = util.promisify(bcrypt.compare);
    const result = await compare(body.password, pass);

    if (result) {
      res.status(200);
      res.json({ message: "jwt" });
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
});

server.get("/me", (req, res) => {});

server.onError((e) => {
  console.error(e);
});

server.listen();
