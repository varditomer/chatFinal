router.get("/getInsights", (req, res) => {
  db.query(
    `
    SELECT username, title, content
    FROM insight
    `,
    function (error, res1) {
      res.send(res1);
    }
  );
});

router.post("/addInsight", (req, res) => {
  db.query(
    `SELECT mediatorCode, title FROM negotiation WHERE negoid=?`,
    [req.body.negoid],
    function (err, res1, fields) {
      db.query(
        `SELECT username FROM user WHERE userCode=?`,
        [res1[0].mediatorCode],
        function (err1, res2) {
          db.query(
            `INSERT INTO insight (username, title, content) VALUES
              ('${res2[0].username}','${res1[0].title}', '${req.body.insight}')`,
            function (error, result) { }
          );
        }
      );
    }
  );
});