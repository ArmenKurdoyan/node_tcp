const { isTokenBlacklisted } = require("../redis");

const meMiddleware = async (req, res, next) => {
  try {
    const userToken = req.headers.token;

    if (await isTokenBlacklisted(userToken)) {
      res.status(401);
      res.json({ message: "Token is blacklisted" });
      return res;
    } else {
      next();
    }
  } catch (error) {
    res.status(401);
    console.error(error);
  }
};

module.exports = meMiddleware;
