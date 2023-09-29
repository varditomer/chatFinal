const express = require("express");
const router = express.Router();
const db = require("../services/db.service");
var nodemailer = require("nodemailer");


router.post("/sendNotification", (req, res) => {
console.log(`req:`, req.body)
  db.query(
    `SELECT userCode FROM user WHERE username=?`,
    [req.body.username],
    function (error, result) {
      console.log(`result:`, result)
      console.log(`'${req.body.notification}','${result[0].userCode}':`, '${req.body.notification}','${result[0].userCode}')
      db.query(
        `INSERT INTO notifications (content, UserCode) VALUES
    ('${req.body.notification}','${result[0].userCode}')`,

        function (error, result) { }
      );
    }
  );
});



router.post("/notification", (req, res) => {
  db.query(
    `SELECT email FROM user WHERE username=? `,
    [req.body.username],
    function (error, result) {
      if (error) {
        console.log(
          "🚀 ~ file: server.js ~ line 157 ~ router.post ~ error",
          error
        );
        return;
      }

      res.send(result[0].email);
    }
  );
});

router.get("/getNotifications/:userCode", (req, res) => {
  const { userCode } = req.params;
  db.query(
    `SELECT id, content FROM notifications WHERE isSeen='0' AND userCode=?  `,
    [userCode],
    function (error, results) {
      if (error) {
        console.log("Error getting user's notifications:", error.message);
        res.status(500).json({ error: "Error getting user's notifications" });
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/markNotificationAsSeen", (req, res) => {
  const { notificationId } = req.body
  db.query(
    `UPDATE notifications SET isSeen='1' WHERE id=?`,
    [notificationId],
    function (error, results) { 
      if (error) {
        console.log("Error reading notification:", error.message);
        res.status(500).json({ error: "Error reading notification" });
      } else {
        res.send(results);
      }
    }
  );
});

module.exports = router;
