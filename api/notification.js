const express = require("express");
const router = express.Router();
const db = require("../services/db.service");
var nodemailer = require("nodemailer");


router.post("/sendNotification", (req, res) => {

  db.query(
    `SELECT userCode FROM user WHERE username=?`,
    [req.body.username],
    function (error, result) {
      //put if user not kaim
      db.query(
        `INSERT INTO notifications (content,UserCode) VALUES
    ('${req.body.notification}','${result[0].userCode}')`,

        function (error, result) { }
      );
    }
  );

  db.query(
    `SELECT email FROM user WHERE username=?`,
    [req.body.username],
    function (error, resi) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "negoflict2555@gmail.com",
          pass: "nidhbqdpouvypnhn",
        },
      });

      var mailOptions = {
        from: "negoflict2555@gmail.com",
        to: `${resi[0].email}`,
        form: "NegoFlict Support",
        subject: "new notification",
        text: "You have a new notification from NegoFlict system.",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
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
      //     const resultEmail =
      //     result && result[0] && result[0].email ? result[0].email : null;
      // res.send({ email: resultEmail });

      res.send(result[0].email);

      // var transporter = nodemailer.createTransport({
      //     service: "gmail",
      //     auth: {
      //         user: "negoflict255@gmail.com",
      //         pass: "barkonyo1",
      //     },
      // });

      // var mailOptions = {
      //     from: "negoflict255@gmail.com",
      //     to: `${JSON.parse(JSON.stringify(result))}`,
      //     subject: "Reset your password in NegoFlict web",
      //     text:
      //         "for reset your password click the next link http://localhost:3000/newpassword.html",
      // };

      // transporter.sendMail(mailOptions, function (error, info) {
      //     if (error) {
      //         console.log(error);
      //     } else {
      //         console.log("Email sent: " + info.response);
      //     }
      // });
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
