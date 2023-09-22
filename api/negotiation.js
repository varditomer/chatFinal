const express = require("express");
const router = express.Router();
const db = require("../services/db.service");
var nodemailer = require("nodemailer");


router.post("/addNegotiation", async (req, res) => {
  try {
    let { userCode1, title, description, topic: topicCode, phone_user2 } = req.body;

    // Find the userCode2 based on the provided phone number
    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT userCode FROM user WHERE phone = ?",
        [phone_user2],
        (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.length === 0) {
      res.status(404).json({
        error: "Phone num. isn't exist",
        phoneNumber: phone_user2,
      });
      return;
    }

    const userCode2 = results[0].userCode;

    // Find a suitable mediator based on expertise and ongoing negotiations
    const mediatorQuery = `
    SELECT user.userCode, 
    SUM(CASE WHEN neg.endTime IS NULL THEN 1 ELSE 0 END) AS numOpenNegotiations
    FROM user
    LEFT JOIN negotiation AS neg ON user.userCode = neg.mediatorCode
    WHERE user.expertiseCode = ? AND user.approved = 1
    GROUP BY user.userCode
    ORDER BY numOpenNegotiations ASC
    LIMIT 1
    `;

    const mediatorResults = await new Promise((resolve, reject) => {
      db.query(
        mediatorQuery,
        [topicCode],
        (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (mediatorResults.length === 0) {
      res.status(404).json({
        error: "No suitable mediator found for the topic",
        topicCode: topicCode,
      });
      return;
    }

    const mediatorCode = mediatorResults[0].userCode;

    // Get the current timestamp in MySQL datetime format ('YYYY-MM-DD HH:MM:SS')
    const formattedStartTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert the negotiation record
    await new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO negotiation (userCode1, userCode2, mediatorCode, topicCode, title, description, startTime)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [userCode1, userCode2, mediatorCode, topicCode, title, description, formattedStartTime],
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
    res.send({ error });
  }
});


router.put("/endNegotiation", (req, res) => {
  const query = `
    UPDATE negotiation SET endTime=current_timestamp() WHERE negoid=?
  `
  const params = [req.body.negoid]
  console.log(`params:`, params)
  db.query(query, params, function (error, result) {
    if (error) res.send('unable to end negotiation')
    else res.send('negotiation ended successfully')
  })
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
        `SELECT mediatorCode, title, description, endTime, summary
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

router.post("/addSummary", (req, res) => {
  db.query(
    `UPDATE negotiation SET summary=? WHERE negoid=?`,
    [req.body.summary, req.body.negoid],
    function (error, result) {
      if (error) {
        console.error('Database error:', error);
        // Send a 500 Internal Server Error status code and a useful error message
        return res.status(500).json({ error: 'Database error', details: error.message });
      }
      // Optionally, check if any rows were updated (optional)
      if (result.affectedRows === 0) {
        // Send a 404 Not Found status code if no rows were updated
        return res.status(404).json({ error: 'No negotiation found with the given negoid' });
      }
      // If no error, send a 200 OK status code and a success message
      res.status(200).json({ success: true, message: 'Summary updated successfully' });
    }
  );
});


// db.query(
//   `SELECT userCode1, userCode2, title FROM negotiation WHERE negoid=?`,
//   [req.body.negoid],
//   function (err, res1) {


// db.query(
//   `SELECT email FROM user WHERE userCode=? OR userCode=?`,
//   [res1[0].userCode1, res1[0].userCode2],
//   function (err, res) {
//     console.log(res);
//     var transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "negoflict2555@gmail.com",
//         pass: "nidhbqdpouvypnhn",
//       },
//     });

//     var mailOptions = {
//       from: "negoflict2555@gmail.com",
//       to: `${res[0].email}, ${res[1].email}`,
//       form: "NegoFlict Support",
//       subject: "Negotiation Summary",
//       text: `The mediator has submit a negotiation summary for negotiation ${res1[0].title} : ${req.body.summary}. 
//         BR, NegoFlict`,
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });
// }
// );
// }
// );

router.post("/continueNegotiations", (req, res) => {
  const { userCode, userType } = req.body;

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
