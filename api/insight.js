// api/insight.js
const express = require("express");
const router = express.Router();
const db = require("../services/db.service");

/**
 * Retrieves insights data from the database.
 * Responds with a list of insights including username, title, and content.
 */
router.get("/getInsights", (req, res) => {
  db.query(
    `
    SELECT username, title, content
    FROM insight
    `,
    function (error, res1) {
      res.send(res1);
    }
  );
});

/**
 * Adds a new insight to the database.
 * Expects request body to contain username, title, and content of the insight.
 */
router.post("/addInsight", (req, res) => {
  const { username, title, content } = req.body
  db.query(
    `INSERT INTO insight (username, title, content) 
    VALUES (?, ?, ?)`,
    [username, title, content],
    function (error, result) {

    }
  );
});

module.exports = router;