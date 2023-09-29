const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//     dialect: process.env.DIALECT,
//     host: process.env.HOST,
//     username: process.env.USERNAME,
//     password: process.env.PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.MYSQL_PORT,
//     logging: false,
// });
const sequelize = new Sequelize(process.env.MYSQL_URI, { logging: false });
module.exports = sequelize;
