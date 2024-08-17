const { blacklistToken } = require("../redis");

const logoutMiddleware = async (req, res, next) => {
  try {
    const userToken = req.headers.token;
    await blacklistToken(userToken);

    next();
  } catch (error) {
    res.status(401);
    console.error(error);
  }
};

module.exports = logoutMiddleware;
