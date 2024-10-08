const net = require("node:net");
const Request = require("./request");
const Response = require("./response");
const Middleware = require("../middlewares/middleware");

class Server {
  #port = 3000;
  #server;
  #routes = {
    get: {},
    post: {},
    patch: {},
    put: {},
    delete: {},
  };

  constructor(port) {
    if (port) this.#port = port;
    this.#server = net.createServer((c) => {
      c.on("data", async (data) => {
        const request = new Request(data.toString());
        const cb = this.#checkRoute(request);
        let result = null;

        for (const callback of cb) {
          const middleware = new Middleware();
          const response = new Response();

          if (callback[Symbol.toStringTag]) {
            await callback(request, response, middleware.next);
          } else {
            callback(request, response, middleware.next);
          }

          result = response;

          if (!middleware.shouldContinue) {
            break;
          }
        }

        if (result) {
          c.write(result.toString());
        }
        c.end();
      });
    });
  }

  #checkRoute(request) {
    const cb = this.#routes[request.verb.toLowerCase()][request.path];
    if (!cb) {
      return [
        (req, res) => {
          res.status(404);
          return res;
        },
      ];
    }
    return cb;
  }

  // METHODS
  get(url, ...cb) {
    this.#routes.get[url] = cb;
  }

  post(url, ...cb) {
    this.#routes.post[url] = cb;
  }

  put(url, ...cb) {
    this.#routes.put[url] = cb;
  }

  patch(url, ...cb) {
    this.#routes.patch[url] = cb;
  }

  delete(url, ...cb) {
    this.#routes["delete"][url] = cb;
  }

  listen(cb) {
    const callback =
      cb ||
      (() => {
        console.log("listening on port ::", this.#port);
      });
    this.#server.listen(this.#port, callback);
  }

  onError(cb) {
    this.#server.on("error", cb);
  }
}

module.exports = Server;
