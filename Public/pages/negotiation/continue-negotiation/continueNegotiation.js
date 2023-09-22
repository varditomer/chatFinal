"use strict";

import { storageService } from "../../../services/storage.service.js";
import { userService } from "../../../services/user.service.js";

const { userCode, userType } = storageService.load("loggedInUser");
const yourUrl = "/api/negotiation/continueNegotiations/"
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
    const titles = userType === "mediator" ? ['Title', 'Start time', 'Negotiator 1', 'Negotiator 2', 'Description'] : ['Title', 'Start time', 'Mediator', 'Negotiator', 'Description']

    if (!negotiations.length) {
      strHtml += `
      <h5 style="display: flex; gap: 10px; align-items: center; font-size: 28px; justify-content: center;">
      <i class="fas fa-gavel" style="color: red; text-decoration: line-through; text-decoration-color: black;"></i>
        You have no new open negotiations
      </h5>
 
      `
      ;
    }
    else {
      strHtml += `
        <h5 style="display: flex; gap: 10px; align-items: center; font-size: 28px; justify-content: center; margin-bottom: 20px">
          <i class="fas fa-gavel"></i>
          Select negotiation to continue
        </h5>

        <div class="row header">
          <div key={title} class="cell">
              ${titles[0]}
          </div>
          <div key={title} class="cell">
              ${titles[1]}
          </div>
          <div key={title} class="cell">
              ${titles[2]}
          </div>
          <div key={title} class="cell">
              ${titles[3]}
          </div>
          <div key={title} class="cell">
              ${titles[4]}
          </div>
        </div>
      `
      negotiations.forEach((negotiation) => {
        console.log(negotiation);
        let { negoid, title } = negotiation;
        const encodedTitle = encodeURIComponent(title);  // Encodes special characters and spaces in the title string for use in a URL
        let user_name_to_render
        if (userType === 'mediator') {
          user_name_to_render = negotiation.user2_name
        } else {
          user_name_to_render = userCode === negotiation.userCode1 ? negotiation.user2_name : negotiation.user1_name
        }

        strHtml +=
          `
          <a class="row" href=/pages/chat/chat.html?negoid=${negoid}&title=${encodedTitle}>
                            <div style="font-weight:600;" class="cell" data-title=${titles[0]}>
                                ${negotiation.title}
                            </div>
                            <div class="cell" data-title=${titles[1]}>
                                ${(negotiation.startTime).substring(0, 10)} ${(negotiation.startTime).substring(11, 16)}
                            </div>
                            <div class="cell capitalize" data-title=${titles[2]}>
                                ${userType === 'mediator' ? negotiation.user1_name : negotiation.mediator_name}
                            </div>
                            <div class="cell" data-title=${titles[3]}>
                                ${user_name_to_render}
                            </div>
                            <div class="cell capitalize" data-title=${titles[4]}>
                                       ${negotiation.description}  
                             </div>
            </a>
`
      });
    }
    document.querySelector(".custom-table").innerHTML = strHtml;

  });

window.goToHomePage = userService.goToHomePage;

