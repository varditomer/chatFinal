// Import required modules
const express = require("express");
const path = require("path");
const http = require("http");
var cors = require("cors");
const cookieParse = require("cookie-parser");
const bodyParser = require("body-parser");
const socketio = require("socket.io");

// Import utility functions from users.js
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./Public/services/utils/users");

// Import message formatting function
const formatMessage = require("./Public/services/utils/messages");

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Create an Express router
const router = express.Router();
app.use(cors());
app.set("trust proxy", true);
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(cookieParse());

// Load environment variables from a .env file in development
if (!process.env.PRODUCTION) {
  const dotenv = require("dotenv");
  const result = dotenv.config();

  if (result.error) {
    throw result.error;
  }
}

// Database connection
const db = require("./services/db.service");

// Serve static files from the "Public" folder
app.use(express.static(path.join(__dirname, "Public")));
app.use("/api", router);

// Import API routers
const authRouter = require("./api/auth");
const negotiationRouter = require("./api/negotiation");
const notificationRouter = require("./api/notification");
const emailRouter = require("./api/email");
const mediatorRouter = require("./api/mediator");
const expertiseRouter = require("./api/expertise");

// Use the imported API routers for specific routes
app.use("/api/auth", authRouter);
app.use("/api/negotiation", negotiationRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/email", emailRouter);
app.use("/api/mediator", mediatorRouter);
app.use("/api/expertise", expertiseRouter);

// Define a chat bot name
const botName = "Nego Bot";

// Socket.io connection handling
io.on("connection", async (socket) => {
  console.log(`🚀 ~ new-connection:`, socket.id)

  // Add a custom event handler for all events
  var onevent = socket.onevent;
  socket.onevent = function (packet) {
    var args = packet.data || [];
    onevent.call(this, packet); // original call
    packet.data = ["*"].concat(args);
    onevent.call(this, packet); // additional call to catch-all
  };

  // Log all socket events and data
  await socket.on("*", function (event, data) {
    console.log(`🚀 ~ event:`, event)
    console.log(`🚀 ~ data:`, data)
  });

  // Handle when a user joins a room
  await socket.on("joinRoom", ({ username, room }) => {
    console.log(`🚀 ~ User ${username} is Joining Room ${room}..`);
    const user = userJoin(socket.id, username, room);
    // adding user's socket to entered room sockets
    socket.join(user.room);

    // Welcome message to the current user
    socket.emit("message", {
      users: getRoomUsers(user.room),
      message: formatMessage(botName, `Welcome ${username} to NegoFlict!`),
    });

    // Load message history from the database and send it to the user
    // const history = [];
    console.log(`🚀 ~ Loading Chat History for new room's user..`);
    db.query(`SELECT negoid FROM negotiation WHERE title=?`,
      [user.room],
      function (err, res) {
        db.query(
          `SELECT content, userCode FROM message WHERE negoid=?`,
          [res[0].negoid],
          function (err, res1) {
            res1.forEach((msg) => {
              db.query(
                `SELECT username FROM user WHERE userCode=?`,
                [msg.userCode],
                function (err, res2) {
                  socket.emit("message", msg.content);
                  io.to(socket.id).emit("message", {
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

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", {
      users: getRoomUsers(user.room),
      message: formatMessage(
        botName,
        `${user.username} has joined the chat`
      ),
    });

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    // Typing indicator sockets
    socket.on("startTyping", function () {
      console.log("isTyping", user.room);
      socket.broadcast
        .to(user.room)
        .emit("isTyping", { user, typing: true });
    });

    socket.on("stopTyping", function () {
      console.log("isNotTyping", user.room);
      socket.broadcast
        .to(user.room)
        .emit("isNotTyping", { user, typing: false });
    });
  });

  // Handle chat messages
  await socket.on("chatMessage", ({ msg, privateMsgTo }) => {
    const user = getCurrentUser(socket.id);
    var users = getRoomUsers(user.room);
    console.log(
      "🚀 ~ file: server.js ~ line 451 ~ socket.on ~ privateMsgTo",
      typeof privateMsgTo,
      user,
      users
    );
    if (privateMsgTo != "null") {
      // Private message handling
      const recipient = users.find((u) => u.id === privateMsgTo);
      io.to(privateMsgTo).emit("privateMsgTo", {
        msg: formatMessage(user.username, msg),
        isSender: false,
        user,
      });
      io.to(user.id).emit("privateMsgTo", {
        msg: formatMessage(user.username, msg),
        isSender: true,
        user: recipient,
      });
    } else {
      // Broadcast the message to all users in the room
      if (!user.room) return console.error(user, "no room?");
      io.to(user.room).emit("message", {
        message: formatMessage(user.username, msg),
      });
    }

    // Save the message in the database
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

    // Check for certain keywords in the message
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
          `Hi ${user.username}, you look a little bit angry. For the success of the negotiation, please try to stay calm`
        ),
      });
    }
  });

  // Handle when a user's chat page loads
  await socket.on("pageLoaded", () => {
    console.log(`11111111111111111:`,)
    const user = getCurrentUser(socket.id);
    console.log(`user:`, user)
    io.to(user.room).emit("pageLoad", { users: getRoomUsers(user.room) });
  });

  // Handle when a user leaves the chat
  await socket.on("userLeft", ({ username, room }) => {
    const user = userLeave(socket.id);
    console.log(`user:`, user)
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

  // Handle when a user disconnects
  await socket.on("disconnect", () => {
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

// Set the server to listen on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, link: http://localhost:${PORT}`);
});
