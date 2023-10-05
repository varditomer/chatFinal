const express = require("express");
const router = express.Router();
const db = require("../services/db.service");


/**
 * Retrieves mediators and negotiators from the database, sorting by userType and lastName.
 * Responds with userCode, firstName, lastName, and userType.
 */
router.get("/getUsers", (req, res) => {
  db.query(
    `SELECT firstName, lastName, userCode, userType 
     FROM user 
     WHERE userType IN ('mediator', 'negotiator')
     ORDER BY FIELD(userType, 'mediator', 'negotiator'), lastName ASC`,
    function (error, result) {
      if (error) {
        console.error(error);
        res.status(500).send('Server Error');
      } else {
        console.log(result);
        res.send(result);
      }
    }
  );
});

/**
 * Retrieves general user information (firstName, lastName, email, username, phone, userType).
 * Responds with a JSON array containing the requested user details.
 */
router.get("/getUsersInfo", (req, res) => {
  db.query(
    `SELECT firstName, lastName, email, username, phone, userType
    FROM user
    `,
    ["manager", 1],
    function (error, result) {
      res.send(result);
    }
  );
});

//  Retrieves user information along with the count of negotiations they're involved in, excluding managers and specific userCode.
//  Responds with userCode, firstName, lastName, userType, and negotiation count (Num).
router.get("/getUserNegotiationsCount", (req, res) => {
  db.query(
    `SELECT  userCode ,firstName , lastName , userType , COUNT(*) AS Num
           FROM user, negotiation
           WHERE user.userCode = negotiation.userCode1 
           OR user.userCode = negotiation.userCode2
           OR user.userCode = negotiation.mediatorCode 
           AND userType!=? AND userCode!=?
           GROUP BY  user.userCode
           `,
    ["manager", 1],
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});

/**
 * Retrieves ongoing negotiations with details such as negotiation ID, title, description, start time, user codes, and mediator code.
 * Responds with negotiation ID, title, description, start time, user codes, and mediator code for active negotiations.
 */
router.get("/getOpenNegotiationsDetails", (req, res) => {
  db.query(
    `SELECT  negoid, title, description, startTime, userCode1, userCode2, mediatorCode
           FROM negotiation
           WHERE endTime IS NULL
           ORDER BY startTime`,
    function (error, result) {
      console.log(JSON.stringify(result));
      res.send(result);
    }
  );
});

/**
 * Retrieves completed negotiations with details such as negotiation ID, title, description, start time, and end time.
 * Responds with negotiation ID, title, description, start time, and end time for completed negotiations.
 */
router.get("/getCompletedNegotiationsDetails", (req, res) => {
  db.query(
    `SELECT  negoid, title, description, startTime, endTime
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
