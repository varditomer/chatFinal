// api/auth.js
const express = require("express");
const router = express.Router();
const db = require("../services/db.service");
var nodemailer = require("nodemailer");


// Route to handle user login
router.post("/login", (req, res) => {
  const username = req.body.userName;
  const password = req.body.password;

  // Query the database to check if the provided username and password exist
  db.query(
    "SELECT * FROM user WHERE username = ? AND password = ? ",
    [username, password],
    (error, results) => {
      if (error) {
        console.log("Error in login:", error.message);
        return res.status(500)
          .json({ error: "login failed" });
      } else {
        if (results.length > 0) {
          // If login is successful, return the user as JSON response
          // remove the password before return user
          delete results[0].password
          res.json(results[0]);
          console.log(`user - '${results[0].username}' Successfully Login`);
        } else {
          // If login fails, return 'no' as response
          console.log("Not registered");
          return res.status(404)
            .json({ error: "Invalid username or password!" });
        }
      }
    }
  );
});

// Route to handle negotiator signup
router.post("/signupNego", (req, res) => {
  // Insert the negotiator details into the database
  db.query(
    `INSERT INTO user (firstName, lastName, email, username, phone, userType, password) VALUES
    (?, ?, ?, ?, ?, ?, ?)`,
    [req.body.firstName, req.body.lastName, req.body.email, req.body.username, req.body.phone, req.body.userType, req.body.password],
    function (error, results) {
      if (error) {
        console.log(`error while registering negotiator:`, error.message);
        return res.status(404)
          .json({ error: "Register failed!" });
      } else {
        // If signup is successful, return the user type as JSON response
        console.log("Success");
        return res.json({ ok: true });
      }
    }
  );

});

// Route to handle mediator signup
router.post("/signupMedi", (req, res) => {
  console.log(`req.body:`, req.body)
  // Insert the mediator details into the database
  db.query(
    `INSERT INTO user (firstName, lastName, email, username, phone, education, userType, password, professionalExperience, expertiseCode) VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.body.firstName, 
      req.body.lastName, 
      req.body.email, 
      req.body.username, 
      req.body.phone, 
      req.body.education, 
      req.body.userType, 
      req.body.password, 
      req.body.professionalExperience,
      +req.body.expertiseCode
    ],
    function (error, results) {
      if (error) {
        console.log(`error while registering mediator:`, error.message);
        return res.status(404)
          .json({ error: "Register failed!" });
      } else {
        // If signup is successful, return the user type as JSON response
        console.log("Success");
        return res.json({ ok: true });
      }
    }
  );
});

router.post("/resetpassword", (req, res) => {
  const email = req.body.email;

  const resetCode = makeCode()

  // בדיקה אם האימייל קיים במסד הנתונים
  db.query(
    "SELECT * FROM user WHERE email = ?",
    email,
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "שגיאה בבדיקת המייל" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "כתובת האימייל אינה קיימת במערכת" });
      }

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "negoflict0110@gmail.com",
          pass: "wvihgmntqxwquwko",
        },
      });

      var mailOptions = {
        from: "negoflict0110@gmail.com",
        to: `${req.body.email}`,
        subject: "Reset your password in NegoFlict web",
        text: `for reset your password click the next link localhost:7005/reset-password, reset-code: ${resetCode}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "שגיאה בשליחת האימייל" });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json({ message: "האימייל נשלח בהצלחה" });
        }
      });
    }
  );
});

router.post("/resetpass", (req, res) => {
  db.query(
    `UPDATE user SET password=
('${req.body.password}') WHERE username=?`,
    [req.body.username],
    function (error, result) { }
  );
});



router.post("/checkUserExists", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;

  // Query the database to check if a user with the given email or username already exists
  db.query(
    "SELECT * FROM user WHERE email = ? OR username = ?",
    [email, username],
    (error, results) => {
      if (error) {
        console.log("Error checking user existence:", error.message);
        res.status(500).json({ message: "Error checking user existence" });
      } else {
        if (results.length > 0) {
          // If user with the provided email or username already exists, return the user object
          const user = results[0];
          res.json(user);
          console.log("User already exists");
        } else {
          // If user does not exist, return an empty response
          res.json({});
          console.log("User does not exist");
        }
      }
    }
  );
});

router.get("/getOtherNegotiators/:username", (req, res) => {
  const { username } = req.params;

  db.query(
    "SELECT * FROM user WHERE userType='negotiator' and username != ?",
    [username],
    (error, results) => {
      if (error) {
        console.log("Error getting negotiators:", error.message);
        res.status(500).json({ message: "Error getting negotiators" });
      } else {
        const negotiators = results;
        res.json(negotiators);
      }
    }
  );
});

module.exports = router;
