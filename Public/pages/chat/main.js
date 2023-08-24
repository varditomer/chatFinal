// Get references to HTML elements
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Retrieve parameters from the URL
var url = new URL(window.location.href);
var params = new URLSearchParams(url.search);
var negoid = params.get("title");
var user = JSON.parse(localStorage.getItem("loggedInUser"));
const username = user.username;

// Set the room based on the URL parameter
const room = negoid;

// Initialize a socket.io connection
const socket = io();

// Get room and users when a user joins the chat
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Handle incoming messages from the server
socket.on("message", ({ message, isSender, user }) => {
  if (message) outputMessage(message, null, null);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom of the chat
});

// Function to execute when the chat page loads
async function onChatLoad() {
  console.log("🚀 ~ Chat is Loading..");
  await socket.emit("joinRoom", { username, room });
  await socket.emit("pageLoaded");
}

// Handle the event when the chat page has loaded
socket.on("pageLoad", ({ users }) => {
  console.log("🚀 ~ Chat was Loaded..");
  if (users) showList(users);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom of the chat
});

// Handle private messages
socket.on("privateMsgTo", ({ msg, isSender, user }) => {
  if (msg) outputMessage(msg, isSender, user);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom of the chat
});

// Typing indicator functionality
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
  console.log("🚀 ~ file: main.js ~ line 99 ~ timeoutFunction ~ stopTyping");
  socket.emit("stopTyping");
}

function onKeyDownNotEnter() {
  if (typing == false) {
    typing = true;
    socket.emit("startTyping");
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
  isTypingEl.innerHTML = typing ? ".....typing" : "";
}

socket.on("isTyping", ({ typing, user }) => {
  setUserElLi(typing, user);
});

socket.on("isNotTyping", ({ typing, user }) => {
  setUserElLi(typing, user);
});

// Event listener for submitting a chat message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get the message text
  const msg = e.target.elements.msg.value;

  // Get the recipient of a private message
  const privateMsgTo = document.getElementById("userof").value;

  // Emit the message to the server
  socket.emit("chatMessage", { msg, privateMsgTo });

  // Clear the input field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Event listener for socket.io events
// const listener = (eventName, ...args) => {
//   // console.log("DEBUG", eventName, args);
// };

// socket.onAny(listener);

// Output a message to the DOM
function outputMessage(msg, isSender = null, user = null) {
  const div = document.createElement("div");
  div.classList.add("message");
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

// Add room name to the DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Show the user list
function showList(users) {
  let htmlStr = `<option value="null">everyone</option>`;
  htmlStr += users
    .filter((u) => u.username != localStorage.getItem("username"))
    .map(
      (user) => /*html*/ `<option value="${user.id}">${user.username}</option>`
    )
    .join("");
  document.getElementById("userof").innerHTML = htmlStr;
}

// Add users to the DOM
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

// Get user list
function getuser() {
  return userList;
}

// Handle leaving the room
function leaveRoom(event) {
  event.preventDefault();
  socket.emit("userLeft", { username, room });
}

// Handle redirecting users when someone leaves the room
socket.on("redirectOut", ({ users, username }) => {
  outputUsers(users);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log(`loggedInUser:`, loggedInUser)
  console.log(`username:`, username)
  if (loggedInUser.username != username) return;
  window.location.href = "../negotiation/continue-negotiation/continue-negotiation.html";
});
