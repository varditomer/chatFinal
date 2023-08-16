const express = require("express");
const path = require("path");
const http = require("http");
var cors = require("cors");
const cookieParse = require("cookie-parser");
const bodyParser = require("body-parser");
const socketio = require("socket.io");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./Public/services/utils/users");

const formatMessage = require("./Public/services/utils/messages");



const app = express();
const server = http.createServer(app);
const io = socketio(server);

const router = express.Router();
app.use(cors());
app.set("trust proxy", true);
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(cookieParse());

if (!process.env.PRODUCTION) {
  const dotenv = require("dotenv");
  const result = dotenv.config();

  if (result.error) {
    throw result.error;
  }
}

// ------------------------------------------------ //
const db = require("./services/db.service");

//set static folder
app.use(express.static(path.join(__dirname, "Public")));
app.use("/api", router);

// -----------APIs:----------------------
// Import other necessary modules
const authRouter = require("./api/auth"); // Import the auth router
const negotiationRouter = require("./api/negotiation"); // Import the negotiation router
const notificationRouter = require("./api/notification"); // Import the notification router
const emailRouter = require("./api/email"); // Import the email router
const mediatorRouter = require("./api/mediator"); // Import the mediators router
const expertiseRouter = require("./api/expertise"); // Import the mediators router


// Use the auth router for the /api/auth route
app.use("/api/auth", authRouter);
app.use("/api/negotiation", negotiationRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/email", emailRouter);
app.use("/api/mediator", mediatorRouter);
app.use("/api/expertise", expertiseRouter);


// +++++++++++++++Sockets+++++++++++++++
const botName = "Nego Bot";

//Run when client connect
io.on("connection", (socket) => {
  var onevent = socket.onevent;
  socket.onevent = function (packet) {
    var args = packet.data || [];
    onevent.call(this, packet); // original call
    packet.data = ["*"].concat(args);
    onevent.call(this, packet); // additional call to catch-all
  };
  socket.on("*", function (event, data) {
    console.log(event);
    console.log(data);
  });

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //welcome current user
    socket.emit("message", {
      users: getRoomUsers(user.room),
      message: formatMessage(botName, "Welcome to NegoFlict!"),
    }); //for personal

    const history = [];
    db.query(`SELECT negoid FROM negotiation WHERE title=?`,
      [user.room],
      function (err, res) {
        db.query(
          `SELECT content,userCode FROM message WHERE negoid=?`,
          [res[0].negoid],
          function (err, res1) {
            res1.forEach((msg) => {
              db.query(
                `SELECT username FROM user WHERE userCode=?`,
                [msg.userCode],
                function (err, res2) {
                  console.log(msg);
                  socket.emit("message", msg.content);
                  io.to(user.room).emit("message", {
                    message: formatMessage(
                      res2[0].username,
                      msg.content
                    ),
                  });
                }
              );
            });
          }
        );
      }
    );



    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", {
      users: getRoomUsers(user.room),
      message: formatMessage(
        botName,
        `${user.username} has joined the chat`
      ),
    });

    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    ///ISTYPING SOCKETS
    socket.on("startTyping", function () {
      console.log("isTyping", user.room);
      socket.broadcast
        .to(user.room)
        .emit("isTyping", { user, typing: true });
    });

    socket.on("stopTyiping", function () {
      console.log("isNotTyping", user.room);
      socket.broadcast
        .to(user.room)
        .emit("isNotTyping", { user, typing: false });
    });
  });

  //problem with the rooms

  //listen for chatMsg
  socket.on("chatMessage", ({ msg, privateMsgTo }) => {
    const user = getCurrentUser(socket.id);
    var users = getRoomUsers(user.room);
    console.log(
      "🚀 ~ file: server.js ~ line 451 ~ socket.on ~ privateMsgTo",
      typeof privateMsgTo,
      user,
      users
    );
    //david sends to baros
    if (privateMsgTo != "null") {
      // the recipient
      const recipient = users.find((u) => u.id === privateMsgTo);
      io.to(privateMsgTo).emit("privateMsgTo", {
        msg: formatMessage(user.username, msg),
        isSender: false,
        user,
      });
      // the sender
      io.to(user.id).emit("privateMsgTo", {
        msg: formatMessage(user.username, msg),
        isSender: true,
        user: recipient,
      });
    } else {
      if (!user.room) return console.error(user, "no room?");
      io.to(user.room).emit("message", {
        message: formatMessage(user.username, msg),
      }); //print everyone
    }

    //save the msg in database
    db.query(
      `SELECT userCode FROM user WHERE username=?`,
      [user.username],
      function (err, res) {
        db.query(
          `SELECT negoid FROM negotiation WHERE title=?`,
          [user.room],
          function (err, res1) {
            db.query(
              `INSERT INTO message (content, userCode,negoid) VALUES ('${msg}','${res[0].userCode}','${res1[0].negoid}')`,
              function (error, result) { }
            );
          }
        );
      }
    );
    word = ["fuck", "no", "dont", "hate", "angry", "!!!", "..."];

    if (
      msg.includes("fuck") === true ||
      msg.includes("hate") === true ||
      msg.includes("?????") === true ||
      msg.includes("hate") === true ||
      msg.includes("angry") === true ||
      msg.includes("shut up") === true
    ) {
      io.to(user.id).emit("message", {
        users: getRoomUsers(user.room),
        message: formatMessage(
          botName,
          `Hi ${user.username}, you look a little bit angry.For the success of the negotiation , please try to stay calm`
        ),
      });
    }
  });

  //listen for chat page load
  socket.on("pageLoaded", () => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("pageLoad", { users: getRoomUsers(user.room) }); //print everyone
  });

  socket.on("userLeft", ({ username, room }) => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        users: getRoomUsers(user.room),
        message: formatMessage(
          botName,
          `${user.username} has left the chat`
        ),
      });

      io.to(user.room).emit("redirectOut", {
        users: getRoomUsers(user.room),
        username,
      });
    }
  });

  //Rums when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        users: getRoomUsers(user.room),
        message: formatMessage(
          botName,
          `${user.username} has left the chat`
        ),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, link: http://localhost:${PORT}`);
});
