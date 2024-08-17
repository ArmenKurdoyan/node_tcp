const Server = require("./lib/server");
const { SeassionController } = require("./controllers");
const server = new Server();
const middlewares = require("./middlewares");

server.post("/timenow", (req, res) => {
  res.json({ time: new Date().toUTCString() });
  return res;
});

server.get("/timenow", (req, res) => {
  res.setCookie("a", 10);
  res.setHeader("authorization", "jwt(token)");
  res.json({ time: new Date().toUTCString() });
  return res;
});

server.get("/me", middlewares.meMiddleware, SeassionController.me);
server.post("/register", SeassionController.register);
server.post("/login", middlewares.loginMiddleware, SeassionController.login);
server.post("/logout", middlewares.logoutMiddleware, SeassionController.logout);

server.onError((e) => {
  console.error(e);
});

server.listen();
