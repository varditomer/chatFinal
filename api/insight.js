// api/insight.js
const express = require("express");
const router = express.Router();
const db = require("../services/db.service");

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