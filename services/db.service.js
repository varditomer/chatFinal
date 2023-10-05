// services/db.service.js
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.HOST,        // The host where the MySQL server is running.
  user: process.env.USER_NAME,   // The username for authenticating with the MySQL server.
  database: process.env.DATABASE  // The name of the database to be used.
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);  // Log an error if the connection fails.
    return;
  }
  console.log("Connected to the database!");  // Log a success message if the connection is established.
});

module.exports = connection;
