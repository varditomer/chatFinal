const express = require("express");
const router = express.Router();
const db = require("../services/db.service");

router.get("/getExpertise", (req, res) => {
    db.query(
      "SELECT * FROM expertise",
      (error, results) => {
        if (error) {
          console.log("Error getting expertise:", error.message);
          res.status(500).json({ message: "Error getting expertise" });
        } else {
          const expertise = results;
          res.json(expertise);
        }
      }
    );
  });

module.exports = router;
