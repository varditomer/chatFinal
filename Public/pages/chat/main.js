//const { disconnect } = require("mongoose");

// const { userLeave } = require("../../utils/users");

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
var usernamee = localStorage.getItem("username");

//Get usrname and room from url to know which in those room
const username = usernamee;
const room = negoid;

//console.log(username,room); #check that it works

const socket = io();

//console.log(username,room); //print to the right web
//join chatroom
socket.emit("joinRoom", { username, room });

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
  console.log("hi");
  socket.emit("pageLoaded");
}
socket.on("pageLoad", ({ users }) => {
  console.log(users);
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
  //get message text
  const msg = e.target.elements.msg.value;

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

/* ------------------------------------ Click on login and Sign Up to  changue and view the effect
---------------------------------------
*/

// function cambiar_login() {
//     document.querySelector(".cont_forms").className =
//         "cont_forms cont_forms_active_login";
//     document.querySelector(".cont_form_login").style.display = "block";
//     document.querySelector(".cont_form_sign_up").style.opacity = "0";

//     setTimeout(function () {
//         document.querySelector(".cont_form_login").style.opacity = "1";
//     }, 400);

//     setTimeout(function () {
//         document.querySelector(".cont_form_sign_up").style.display = "none";
//     }, 200);
// }

// function cambiar_sign_up(at) {
//     document.querySelector(".cont_forms").className =
//         "cont_forms cont_forms_active_sign_up";
//     document.querySelector(".cont_form_sign_up").style.display = "block";
//     document.querySelector(".cont_form_login").style.opacity = "0";

//     setTimeout(function () {
//         document.querySelector(".cont_form_sign_up").style.opacity = "1";
//     }, 100);

//     setTimeout(function () {
//         document.querySelector(".cont_form_login").style.display = "none";
//     }, 400);
// }

// function ocultar_login_sign_up() {
//     document.querySelector(".cont_forms").className = "cont_forms";
//     document.querySelector(".cont_form_sign_up").style.opacity = "0";
//     document.querySelector(".cont_form_login").style.opacity = "0";

//     setTimeout(function () {
//         document.querySelector(".cont_form_sign_up").style.display = "none";
//         document.querySelector(".cont_form_login").style.display = "none";
//     }, 500);
// }

const exitUser = document.getElementById("exitUser");
exitUser.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("hi");
  socket.emit("userLeft", { username, room });
});

socket.on("redirectOut", ({ users, username }) => {
  console.log("bye");
  outputUsers(users);

  var loggedUser = localStorage.getItem("username");
  if (loggedUser != username) return;
  window.location.href = "../enterNegotiation/enterNegotiation.html";
});
