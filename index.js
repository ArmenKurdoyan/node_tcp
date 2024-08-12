const Server = require("./server");

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

server.onError((e) => {
  console.error(e);
});

server.listen();
