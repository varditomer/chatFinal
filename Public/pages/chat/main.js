
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages"); //for chesee which chat to talk
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Retrieve params via url.search, passed into ctor
var url = new URL(window.location.href);
// console.log("🚀 ~ file: main.js ~ line 39 ~ window.location.href", window.location.href)
var params = new URLSearchParams(url.search);
// console.log("🚀 ~ file: main.js ~ line 13 ~ params", params.get('title'),params.get('negoid'))

var negoid = params.get("title");
var user = JSON.parse((localStorage.getItem("loggedInUser")));
const username = user.username


//Get usrname and room from url to know which in those room
const room = negoid;

//console.log(username,room); #check that it works

const socket = io();
console.log(`==================================:`,)
//console.log(username,room); //print to the right web
//join chatroom

//get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from server
socket.on("message", ({ message, isSender, user }) => {
  console.log(message, user, isSender); //print the msg from server welcome to nego and the other msgss
  if (message) outputMessage(message, null, null);
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function onChatLoad() {
  console.log(`5555555555555555:`,)
  console.log(`user-from-storage:`, user)
  console.log(`username:`, username)
  socket.emit("joinRoom", { username, room });
  console.log(`00000000000000000000000000:`,)
  console.log("hi");
  socket.emit("pageLoaded");
}

socket.on("pageLoad", ({ users }) => {
  console.log(`users:`, users)
  if (users) showList(users);
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
socket.on("privateMsgTo", ({ msg, isSender, user }) => {
  console.log("🚀 ~ file: main.js ~ line 55 ~ socket.on ~ msg,isSender ", {
    msg,
    isSender,
    user,
  });

  if (msg) outputMessage(msg, isSender, user);
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//////////////TYPING SOCKET START
const inputEl = document.getElementById("msg");

var timeout = null;
var typing = false;
inputEl.addEventListener("keypress", (e) => {
  if (e.keyCode != 13) {
    onKeyDownNotEnter();
  }
});

function timeoutFunction() {
  typing = false;
  console.log("🚀 ~ file: main.js ~ line 99 ~ timeoutFunction ~ stopTyiping");
  socket.emit("stopTyiping");
}

function onKeyDownNotEnter() {
  if (typing == false) {
    typing = true;
    socket.emit("startTyping");
    console.log(
      "🚀 ~ file: main.js ~ line 101 ~ onKeyDownNotEnter ~ startTyping"
    );
    timeout = setTimeout(timeoutFunction, 1000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
  }
}

function setUserElLi(typing, user) {
  const isTypingEl = document.querySelector(
    `li[data-user-id="${user.id}"] .is-typing`
  );
  console.log(
    "🚀 ~ file: main.js ~ line 113 ~ socket.on ~ isTypingEl",
    isTypingEl
  );
  isTypingEl.innerHTML = typing ? ".....typing" : "";
}
socket.on("isTyping", ({ typing, user }) => {
  console.log(`11111:`,)
  setUserElLi(typing, user);
  console.log(
    "🚀 ~ file: main.js ~ line 111 ~ socket.on ~ typing",
    user,
    typing
  );
});
socket.on("isNotTyping", ({ typing, user }) => {
  setUserElLi(typing, user);
  console.log(
    "🚀 ~ file: main.js ~ line 114 ~ socket.on ~ typing",
    user,
    typing
  );
});
//////////////////TYPING SOCKET END
//msg submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(`e:`, e)
  //get message text
  const msg = e.target.elements.msg.value;
  console.log(`msg:`, msg)

  const privateMsgTo = document.getElementById("userof").value;
  console.log(
    "🚀 ~ file: main.js ~ line 62 ~ chatForm.addEventListener ~ privateMsgTo",
    { msg, privateMsgTo }
  );

  //emit message to server to the board
  socket.emit("chatMessage", { msg, privateMsgTo });

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus(); //write enter messege
});

const listener = (eventName, ...args) => {
  console.log("DEBUG", eventName, args);
};

socket.onAny(listener);

//output message to Dom
function outputMessage(msg, isSender = null, user = null) {
  console.log({ msg, user, isSender });
  const div = document.createElement("div");
  div.classList.add("message"); //add class messege
  const privateMsgTo = document.getElementById("userof").value;
  var privateMsgFormat = "";
  if (isSender === null) {
    privateMsgFormat = "";
  } else {
    privateMsgFormat = isSender
      ? "Private message to " + user.username + ":"
      : "Private message from " + user.username + ":";
  }

  div.innerHTML = `
    <p class="meta">
        <sapn>${msg.username}</span> 
        <span>${msg.time}</span>
    </p>    
    <p class="text">
        ${isSender !== null ? privateMsgFormat : ""}
        ${msg.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//Add room name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

//show in list
function showList(users) {
  console.log("🚀 ~ file: main.js ~ line 77 ~ showList ~ users", users);
  let htmlStr = `<option value="null">everyone</option>`;
  htmlStr += users
    .filter((u) => u.username != localStorage.getItem("username"))
    .map(
      (user) => /*html*/ `<option value="${user.id}">${user.username}</option>`
    )
    .join("");
  document.getElementById("userof").innerHTML = htmlStr;
}

//Add users to dom
function outputUsers(users) {
  userList.innerHTML = `
    ${users
      .map(
        (user) =>
          `<li data-user-id="${user.id}">${user.username}<span class="is-typing"></span></li>`
      )
      .join("")}
    `;
}

function getuser() {
  return userList;
}

function leaveRoom(event) {
  event.preventDefault();
  console.log("hi");
  socket.emit("userLeft", { username, room });
  window.location.href="../negotiation/continue-negotiation/continue-negotiation.html"
}

socket.on("redirectOut", ({ users, username }) => {
  console.log("bye");
  outputUsers(users);

  var loggedUser = localStorage.getItem("username");
  if (loggedUser != username) return;
  window.location.href = "../enterNegotiation/enterNegotiation.html";
});
