const { Sequelize } = require("sequelize");
const dbConfig = require("./config.json");
// const sequelize = new Sequelize(
//   "postgres://armen:p1ssw0rd@localhost:5432/armen"
// );
const sequelize = new Sequelize(
  dbConfig[process.env.NODE_ENV || "development"]
);

module.exports = sequelize;
