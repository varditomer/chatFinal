"use strict";

// Import required services
import { storageService } from "../../../services/storage.service.js";
import { userService } from "../../../services/user.service.js";

// Retrieve user information from local storage
const { userCode, userType } = storageService.load("loggedInUser");

// API endpoint to fetch open negotiations for the current user
const yourUrl = "/api/negotiation/continueNegotiations/";

// Fetch open negotiations from the server
fetch(yourUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ userCode, userType })
})
  .then((res) => res.json())
  .then((res) => {
    let strHtml = "";
    const negotiations = res;

    // Determine table column titles based on the user type
    const titles = userType === "mediator" ? ['Title', 'Start time', 'Negotiator 1', 'Negotiator 2', 'Description'] : ['Title', 'Start time', 'Mediator', 'Negotiator', 'Description'];

    // Generate HTML content based on retrieved negotiations
    if (!negotiations.length) {
      // Display a message if the user has no open negotiations
      strHtml += `
        <h5 style="display: flex; gap: 10px; align-items: center; font-size: 28px; justify-content: center;">
          <i class="fas fa-gavel" style="color: red; text-decoration: line-through; text-decoration-color: black;"></i>
          You have no open negotiations
        </h5>
      `;
    } else {
      // Display open negotiations in a table format
      strHtml += `
        <h5 style="display: flex; gap: 10px; align-items: center; font-size: 28px; justify-content: center; margin-bottom: 20px">
          <i class="fas fa-gavel"></i>
          Select negotiation to continue
        </h5>

        <!-- Table header -->
        <div class="row header">
          ${titles.map((title) => `<div class="cell">${title}</div>`).join("")}
        </div>
      `;

      // Iterate through negotiations and create rows for each negotiation
      negotiations.forEach((negotiation) => {
        const { negoid, title, startTime, user1_name, user2_name, mediator_name, description } = negotiation;

        // Encode the title for safe use in URL
        const encodedTitle = encodeURIComponent(title);

        // Determine the username to render based on user type
        let user_name_to_render;
        if (userType === 'mediator') {
          user_name_to_render = negotiation.user2_name;
        } else {
          user_name_to_render = userCode === negotiation.userCode1 ? negotiation.user2_name : negotiation.user1_name;
        }

        // Generate HTML for the negotiation row and add it to strHtml
        strHtml += `
          <a class="row" href=/pages/chat/chat.html?negoid=${negoid}&title=${encodedTitle}>
            <div style="font-weight:600;" class="cell" data-title=${titles[0]}>${title}</div>
            <div class="cell" data-title=${titles[1]}>${startTime.substring(0, 10)} ${startTime.substring(11, 16)}</div>
            <div class="cell capitalize" data-title=${titles[2]}>${userType === 'mediator' ? user1_name : mediator_name}</div>
            <div class="cell" data-title=${titles[3]}>${user_name_to_render}</div>
            <div class="cell capitalize" data-title=${titles[4]}>${description}</div>
          </a>`;
      });
    }

    // Populate the table with generated HTML content
    document.querySelector(".custom-table").innerHTML = strHtml;
  });

// Expose the goToHomePage function from userService to the global scope
window.goToHomePage = userService.goToHomePage;
