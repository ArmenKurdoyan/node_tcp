class Middleware {
  #shouldContinue;
  constructor() {
    this.#shouldContinue = false;
  }
  next = () => {
    this.#shouldContinue = true;
  };

  get shouldContinue() {
    return this.#shouldContinue;
  }
}

module.exports = Middleware;
