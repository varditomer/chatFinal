const express = require("express");
const router = express.Router();
var nodemailer = require("nodemailer");


router.post("/sendEmail", (req, res) => {
    console.log(req.body);
  
    // var transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "negoflict2555@gmail.com",
    //     pass: "nidhbqdpouvypnhn",
    //   },
    // });
  
    // var mailOptions = {
    //   from: "negoflict2555@gmail.com",
    //   to: "negoflict2555@gmail.com",
    //   form: "NegoFlict Support",
    //   subject: `${req.body.subject}`,
    //   text: `'This is mail from the web. The mail was sent by ${req.body.firstname} ${req.body.lastName}. phone: ${req.body.phone}. Message content: ${req.body.description}`,
    // };
  
    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });
  });

module.exports = router;
