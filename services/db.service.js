// services/db.service.js
const mysql = require("mysql");
console.log(process.env.HOST,process.env.USER,process.env.DATABASE);

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

module.exports = connection;
