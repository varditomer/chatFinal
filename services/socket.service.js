const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
// const db = require('../services/db.service')

var gIo = null
const botName = "Nego Bot";

function setupSocketAPI(server) {
    gIo = socketio(server, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
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
            // db.query(
            //     `SELECT negoid FROM negotiation WHERE title=?`,
            //     [user.room],
            //     function (err, res) {
            //         db.query(
            //             `SELECT content,userCode FROM message WHERE negoid=?`,
            //             [res[0].negoid],
            //             function (err, res1) {
            //                 res1.forEach((msg) => {
            //                     db.query(
            //                         `SELECT username FROM user WHERE userCode=?`,
            //                         [msg.userCode],
            //                         function (err, res2) {
            //                             console.log(msg);
            //                             socket.emit("message", msg.content);
            //                             io.to(user.room).emit("message", {
            //                                 message: formatMessage(res2[0].username, msg.content),
            //                             });
            //                         }
            //                     );
            //                 });
            //             }
            //         );
            //     }
            // );

            //Broadcast when a user connects
            socket.broadcast.to(user.room).emit("message", {
                users: getRoomUsers(user.room),
                message: formatMessage(botName, `${user.username} has joined the chat`),
            });

            //send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });

            ///ISTYPING SOCKETS
            socket.on("startTyping", function () {
                console.log("isTyping", user.room);
                socket.broadcast.to(user.room).emit("isTyping", { user, typing: true });
            });

            socket.on("stopTyiping", function () {
                console.log("isNotTyping", user.room);
                socket.broadcast
                    .to(user.room)
                    .emit("isNotTyping", { user, typing: false });
            });
        });
        // console.log('New Ws db...');  //when we reload the page we have msg on the traminal that new ws is created

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
            // db.query(
            //     `SELECT userCode FROM user WHERE username=?`,
            //     [user.username],
            //     function (err, res) {
            //         db.query(
            //             `SELECT negoid FROM negotiation WHERE title=?`,
            //             [user.room],
            //             function (err, res1) {
            //                 console.log(res[0].userCode, res1[0].negoid);
            //                 db.query(
            //                     `INSERT INTO message (content, userCode,negoid) VALUES ('${msg}','${res[0].userCode}','${res1[0].negoid}')`,
            //                     function (error, result) { }
            //                 );
            //             }
            //         );
            //     }
            // );
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
                    message: formatMessage(botName, `${user.username} has left the chat`),
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
                    message: formatMessage(botName, `${user.username} has left the chat`),
                });
            }
        });
    })
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
}
