const querystring = require("node:querystring");

class Request {
  #headers = {};
  #body = "";
  #path = "";
  #verb = "";
  #query = "";
  #parsers = {
    "application/json": JSON.parse,
  };

  get headers() {
    return this.#headers;
  }
  get body() {
    return this.#body;
  }
  get path() {
    return this.#path;
  }
  get verb() {
    return this.#verb;
  }
  get query() {
    return this.#query;
  }
  get parsers() {
    return this.#parsers;
  }

  constructor(msg) {
    const requestLines = msg.split("\r\n");
    let requestVerb = requestLines.shift();
    requestVerb = requestVerb.split(" ");
    this.#verb = requestVerb[0];

    // function checkQuery() {
    if (requestVerb[1].includes("?")) {
      const [path, query] = requestVerb[1].split("?");

      this.#query = querystring.decode(query);
      this.#path = path;
    } else {
      this.#path = requestVerb[1];
    }

    for (let line of requestLines) {
      if (!line) {
        break;
      }

      const [key, value] = line.split(": ");
      this.#headers[key.toLowerCase()] = value;
    }

    if (this.#headers["content-length"]) {
      let body = requestLines[requestLines.length - 1];
      body = body.slice(
        body.length - this.#headers["content-length"],
        body.length
      );
      this.#body = body;
    }
  }

  parseBody() {
    if (!this.#parsers[this.#headers["content-type"]])
      throw new Error(
        `${this.#headers["content-type"]} parser not implemented`
      );
    this.#parsers[this.#headers["content-type"]](this.#body);
  }

  registerParser(applicationType, fn) {
    this.#parsers[applicationType] = fn;
  }

  toString() {
    return JSON.stringify({
      headers: this.#headers,
      body: this.#body,
      path: this.#path,
      verb: this.#verb,
      query: this.#query,
      parsers: this.#parsers,
    });
  }
}

module.exports = Request;
