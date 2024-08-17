const httpStatusCodes = require("./constants");

class Response {
  #headers = {};
  #responseBody = "";
  #cookies = [];
  #code = httpStatusCodes[200];

  constructor() {}

  setHeader(key, value) {
    this.#headers[key] = value;
  }

  setCookie(key, value) {
    this.#cookies.push({ key, value });
  }

  status(code) {
    this.#code = httpStatusCodes[code];
  }

  json(body) {
    if (this.#headers["content-type"])
      throw new Error("Response has already been sent");
    this.#headers["content-type"] = "application/json";
    this.#responseBody = JSON.stringify(body);
    this.#headers["content-length"] = this.#responseBody.length;
  }

  html(body) {
    if (this.#headers["content-type"])
      throw new Error("Response has already been sent");
    this.#headers["content-type"] = "application/html";
    this.#responseBody = body;
    this.#headers["content-length"] = this.#responseBody.length;
  }

  #cookiesAsHeader() {
    if (this.#cookies.length) {
      this.#headers["set-cookie"] = this.#cookies
        .map((cookie) => {
          return `${cookie.key}=${cookie.value}`;
        })
        .join("; ");
    }
  }

  #headersToString() {
    this.#cookiesAsHeader();
    return Object.keys(this.#headers)
      .map((key) => {
        const value = this.#headers[key];
        return `${key}: ${value}`;
      })
      .join("\n\r");
  }

  toString() {
    return `HTTP/1.1 ${this.#code}\r\n${this.#headersToString()}\r\n\r\n${
      this.#responseBody
    }`;
  }
}

module.exports = Response;
