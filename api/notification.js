const express = require("express");
const router = express.Router();
const db = require("../services/db.service");
let nodemailer = require("nodemailer");

/**
 * Sends a notification to a specified user and stores it in the database.
 * Expects request body to contain notification content and user code.
 */
router.post("/sendNotification", (req, res) => {
  db.query(
    `INSERT INTO notifications (content, UserCode) VALUES (?, ?)`,
    [req.body.notification, req.body.userCode],  // Updated line
    function (error, result) {
      if (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send notification' });
      } else {
        res.send({ message: 'Notification sent successfully' });
      }
    }
  );
});

/**
 * Retrieves the email associated with a specific username.
 * Expects request body to contain the username.
 */
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

/**
 * Retrieves unread notifications for a user based on their user code.
 * Expects user code as a route parameter.
 */
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

/**
 * Marks a notification as seen.
 * Expects request body to contain the notification ID.
 */
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
