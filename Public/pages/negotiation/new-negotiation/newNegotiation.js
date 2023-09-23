import { userService } from "../../../services/user.service.js";

// Get the logged-in user
const loggedInUser = userService.getLoggedInUser();

// Function to add a new negotiation
function addNegotiation() {
  const yourUrl = "/api/negotiation/addNegotiation";

  // Create the new negotiation data
  const newNegotiationData = {
    userCode1: loggedInUser.userCode,
    phone_user2: document.getElementById("phone").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    topic: document.getElementById("topic").value,
    topicDescription: (document.getElementById("topic").value === '-1') ? document.getElementById("otherTopic").value : null,
  };

  console.log(`newNegotiationData:`, newNegotiationData)

  // Create a new POST request using the fetch API
  fetch(yourUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newNegotiationData),
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        alert(`${phone} isn't exist`);
      } else {
        // Message when the request is successfully sent
        alert("Request sent successfully");
        window.location.href = "/pages/home/negotiator/negotiator-page.html";
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });
}

// Function to populate the topics select dropdown
function populateTopics(topics) {
  const topicSelect = document.getElementById("topic");

  topics.forEach(topic => {
    const option = document.createElement("option");
    option.value = topic.expertiseCode;
    option.textContent = topic.name.replace(" Law", ""); // Remove ' Law' from the name
    topicSelect.appendChild(option);
  });

  // adding 'other' option
  const line = document.createElement("option");
  line.disabled = true;
  line.textContent = '──────────';
  topicSelect.appendChild(line);

  // adding 'other' option
  const option = document.createElement("option");
  option.value = -1;
  option.textContent = 'Other';
  option.style = "color: #78acfe; font-weight: 600"
  topicSelect.appendChild(option);
}

// Fetch negotiation topics and populate the select dropdown
const topicsUrl = "/api/expertise/getExpertise";
fetch(topicsUrl, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then(res => res.json())
  .then(res => {
    if (!res.error) {
      populateTopics(res);
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

// Function to handle topic change
function handleTopicChange() {
  const topicSelect = document.getElementById("topic");
  const otherTopicDiv = document.getElementById("otherTopicDiv");
  otherTopicDiv.hidden = (topicSelect.value !== "-1");
}

// Expose the functions to the global scope
window.goToHomePage = userService.goToHomePage;
window.addNegotiation = addNegotiation;
window.handleTopicChange = handleTopicChange;
