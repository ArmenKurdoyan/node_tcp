const redis = require("redis");
const util = require("util");
const jwt = require("jsonwebtoken");

const redisClient = redis.createClient();
redisClient.connect();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

const setAsync = (key, value, ...args) => redisClient.set(key, value, ...args);
const getAsync = (key) => redisClient.get(key);
const delAsync = (key) => redisClient.del(key);

exports.blacklistToken = async (token) => {
  const decoded = jwt.decode(token);
  const exp = decoded.exp * 1000;

  await setAsync(token, "blacklisted", "PX", exp - Date.now());
};

exports.isTokenBlacklisted = async (token) => {
  const result = await getAsync(token);
  return result === "blacklisted";
};
