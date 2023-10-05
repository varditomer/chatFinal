const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require("../services/db.service");

router.post("/", (req, res) => {
  const { firstName, lastName, mail, phone, subject, description, userType, username } = req.body;

  // Insert data into contact_us table
  const insertQuery = `
    INSERT INTO contact_us (firstName, lastName, mail, phone, subject, description, userType, username)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(insertQuery, [firstName, lastName, mail, phone, subject, description, userType, username], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }

    // Setup mail transporter
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "negoflict0110@gmail.com",
        pass: "wvih gmnt qxwq uwko",
      },
    });

    // Send email to user
    var mailOptionsToUser = {
      from: "negoflict0110@gmail.com",
      to: mail,
      subject: "Your appeal has been received - NegoFlict",
      text: "Thank you for contacting us. Your appeal is being taken care of.",
    };
    
    transporter.sendMail(mailOptionsToUser, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent to user: " + info.response);
      }
    });

    // Send email to NegoFlict
    var mailOptionsToNegoFlict = {
      from: "negoflict0110@gmail.com",
      to: "negoflict0110@gmail.com",  // Assuming this is the NegoFlict support email
      subject: `New appeal received from ${firstName} ${lastName}`,
      text: `
        Subject: ${subject}
        Description: ${description}
        Email: ${mail}
        Phone: ${phone}
        UserType: ${userType}
        Username: ${username}
      `,
    };

    transporter.sendMail(mailOptionsToNegoFlict, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent to NegoFlict: " + info.response);
      }
    });

    res.status(200).json({ message: 'Appeal submitted successfully' });
  });
});

router.get("/", (req, res) => {
  db.query(`SELECT * FROM contact_us`, function (error, results) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
