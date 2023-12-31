const express = require("express");
const router = express.Router();
const db = require("../services/db.service");
var nodemailer = require("nodemailer");


router.post("/addNegotiation", async (req, res) => {
  try {
    let { userCode1, title, description, topic: topicCode, identifier_user2, topicDescription } = req.body;

    const queryStr = `
      SELECT userCode, userType FROM user
      WHERE (phone = ? OR username = ?) AND userCode <> ?
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(
        queryStr,
        [identifier_user2, identifier_user2, userCode1],
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
        error: "Phone or Username isn't exist or belongs to you!",
        identifier: identifier_user2,
      });
      return;
    }

    const { userCode: userCode2, userType } = results[0];

    if (userType !== 'negotiator') {
      res.status(400).json({
        error: "The user is not a negotiator",
        identifier: identifier_user2,
      });
      return;
    }

 
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

    let mediatorCode

    if (mediatorResults.length === 0) {
      mediatorCode = null
    } else {
      mediatorCode = mediatorResults[0].userCode;
    }
    
    // Get the current timestamp in MySQL datetime format ('YYYY-MM-DD HH:MM:SS')
    const formattedStartTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert the negotiation record
    await new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO negotiation (userCode1, userCode2, mediatorCode, topicCode, title, description, startTime, topicDescription)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [userCode1, userCode2, mediatorCode, topicCode, title, description, formattedStartTime, topicDescription],
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
  console.log(req.body);
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

router.get("/negotiationSummary/:username", (req, res) => {
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
          SELECT n.negoid, n.title, n.description, n.startTime, n.endTime,
          CONCAT(u1.firstName, ' ', u1.lastName) AS user1_name, u1.userCode AS userCode1,
          CONCAT(u2.firstName, ' ', u2.lastName) AS user2_name, u2.userCode AS userCode2,
          CONCAT(m.firstName, ' ', m.lastName) AS mediator_name, m.userCode AS mediatorCode
          FROM negotiation AS n
          LEFT JOIN user AS u1 ON n.userCode1 = u1.userCode
          LEFT JOIN user AS u2 ON n.userCode2 = u2.userCode
          LEFT JOIN user AS m ON n.mediatorCode = m.userCode
          WHERE endTime IS NULL AND (userCode1=? OR userCode2=?) AND n.mediatorCode IS NOT NULL
          ORDER BY n.startTime;
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
          SELECT n.negoid, n.title, n.description, n.startTime, n.endTime,
          CONCAT(u1.firstName, ' ', u1.lastName) AS user1_name, u1.userCode AS userCode1,
          CONCAT(u2.firstName, ' ', u2.lastName) AS user2_name, u2.userCode AS userCode2,
          CONCAT(m.firstName, ' ', m.lastName) AS mediator_name, m.userCode AS mediatorCode
          FROM negotiation AS n
          LEFT JOIN user AS u1 ON n.userCode1 = u1.userCode
          LEFT JOIN user AS u2 ON n.userCode2 = u2.userCode
          LEFT JOIN user AS m ON n.mediatorCode = m.userCode
          WHERE n.endTime IS NULL AND n.mediatorCode = ? AND n.mediatorCode IS NOT NULL
          ORDER BY n.startTime;
          `,
          [userCode],
          function (error, result) {
              if (error) console.log(`error.message:`, error.message)
              res.send(result);
          }
      );
  }
});

router.get("/getUnassignedNegotiations", async (req, res) => {
  try {
    const queryStr = `
      SELECT * FROM negotiation WHERE mediatorCode is null
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(queryStr, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    res.json(results);
  } catch (error) {
    console.log(error);
    res.send({ error });
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

router.post('/assignMediator', (req, res) => {
  console.log(`req.body:`, req.body);
  const { negotiationID, mediatorUserCode, mediatorExpertiseCode } = req.body;

  if (!negotiationID || !mediatorUserCode || !mediatorExpertiseCode) {
    res.status(400).send('Bad request: missing required parameters');
    return;
  }

  const query = `
    UPDATE negotiation
    SET mediatorCode = ?,
        topicCode = ?
    WHERE negoid = ?
  `;

  db.query(query, [mediatorUserCode, mediatorExpertiseCode, negotiationID], function (error, result) {
    if (error) {
      console.error('Error updating data:', error);
      res.status(500).send('Internal server error');
    } else {
      res.send({ message: 'Mediator and topic assigned successfully', result });
    }
  });
});



module.exports = router;
