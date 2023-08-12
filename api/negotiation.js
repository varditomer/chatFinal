const express = require("express");
const router = express.Router();
const db = require("../services/db.service");
var nodemailer = require("nodemailer");


router.post("/addNegotiation", async (req, res) => {
  try {
    const { title, description } = req.body
    const id1 = req.body.user1.userCode
    const phoneNumber = req.body.user2.phone
    let id2;
    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT userCode FROM user WHERE phone = ?",
        [phoneNumber],
        (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.length > 0) {
      id2 = JSON.parse(JSON.stringify(results))[0].userCode;
    } else {
      res.status(404).json({
        error: "Phone num. isn't exist",
        phoneNumber: phoneNumber,
      });
      return;
    }

    // Get current timestamp in milliseconds
    const timestamp = Date.now();

    // Convert timestamp to MySQL datetime format ('YYYY-MM-DD HH:MM:SS')
    const formattedStartTime = new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');

    await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO negotiation (userCode1, userCode2, title, description, startTime) VALUES ('${id1}','${id2}','${title}','${description}' ,'${formattedStartTime}')`,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
    res.status(200).json({ message: "Negotiation added" });
  } catch (error) {
    console.log(error);
    res.send({error});
  }
});

router.post("/endNegotiation", (req, res) => {
  db.query(
    `SELECT userType
          FROM user
          WHERE username=?`,
    [req.body.name],
    function (error, result0) {
      if (result0[0].userType == "mediator") {
        db.query(
          `UPDATE negotiation SET endTime=current_timestamp() WHERE negoid=?`,
          [req.body.negoid],
          function (error, result) { }
        );
        res.send("b");
      } else {
        res.send("no");
      }
    }
  );
});

router.get("/viewNegotiations/:username", (req, res) => {
  const { username } = req.params;
  db.query(
    `SELECT userCode FROM user WHERE username=?`,
    [username],
    function (error, result) {
      var id = result[0].userCode;
      //fix to find number two
      db.query(
        `SELECT negoid, title FROM negotiation WHERE (mediatorCode=? OR userCode1=? OR userCode2=?)
                  AND endTime IS NULL AND`,
        [id, id, id],
        function (err, resl, fields) {
          if (err) throw err;
          res.send(resl);
        }
      );
    }
  );
});

router.get("/query8/:username", (req, res) => {
  const { username } = req.params;
  console.log(`username:`, username)
  db.query(
    `SELECT userCode FROM user WHERE username=?`,
    [username],
    function (error, result) {
      db.query(
        `SELECT  mediatorCode, title, description, endTime, summary
              FROM negotiation
              WHERE summary IS NOT NULL AND mediatorCode=?
              ORDER BY endTime`,
        [result[0].userCode],
        function (error, res1) {
          console.log(`res1:`, res1)
          res.send(res1);
        }
      );
    }
  );
});

router.get("/viewNegotiation", (req, res) => {
  db.query(
    `SELECT negoid, title, description FROM negotiation WHERE mediatorCode=?`,
    [100],
    function (error, result) {
      res.send(result);
    }
  );
});

router.post("/addsummary", (req, res) => {
  db.query(
    `UPDATE negotiation SET summary=? WHERE negoid=?`,
    [req.body.summary, req.body.negoid],
    function (error, result) { }
  );
  db.query(
    `SELECT userCode1, userCode2, title FROM negotiation WHERE negoid=?`,
    [req.body.negoid],
    function (err, res1) {
      db.query(
        `SELECT email FROM user WHERE userCode=? OR userCode=?`,
        [res1[0].userCode1, res1[0].userCode2],
        function (err, res) {
          console.log(res);
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "negoflict2555@gmail.com",
              pass: "nidhbqdpouvypnhn",
            },
          });

          var mailOptions = {
            from: "negoflict2555@gmail.com",
            to: `${res[0].email}, ${res[1].email}`,
            form: "NegoFlict Support",
            subject: "Negotiation Summary",
            text: `The mediator has submit a negotiation summary for negotiation ${res1[0].title} : ${req.body.summary}. 
              BR, NegoFlict`,
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
    }
  );
});

router.post("/continueNegotiations", (req, res) => {
  const { userCode, userType } = req.body;
  console.log(`userCode:`, userCode)
  console.log(`userType:`, userType)

  if (userType === 'negotiator') {
    db.query(
      `
      SELECT negoid, title, description, startTime, endTime
      FROM negotiation
      WHERE endTime IS NULL AND userCode1=? OR endTime IS NULL AND userCode2=?
      ORDER BY startTime
    `,
      [userCode, userCode],
      function (error, result) {
        if (error) console.log(`error.message:`, error.message)
        res.send(result);
      }
    );
  } else {
    console.log(`userCode:`, userCode)
    db.query(
      `
      SELECT negoid, title, description, startTime, endTime
      FROM negotiation
      WHERE endTime IS NULL AND mediatorCode=?
      ORDER BY startTime
    `,
      [userCode],
      function (error, result) {
        if (error) console.log(`error.message:`, error.message)
        console.log(`result:`, result)
        res.send(result);
      }
    );

  }

});

router.get("/query7", (req, res) => {
  db.query(
    `SELECT negoid, title, description, startTime, endTime
       FROM negotiation
        WHERE endTime IS NOT NULL
        ORDER BY startTime`,
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});



module.exports = router;
