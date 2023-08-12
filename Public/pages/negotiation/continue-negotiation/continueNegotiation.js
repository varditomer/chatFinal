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
    console.log(`res:`, res)
    let strHtml = "";
    const negotiations = res;

    if (!negotiations.length) {
      strHtml += `<h5>You have no new open negotiations</h5>`;
    }
    else {
      negotiations.forEach((obj) => {
        let { negoid, title } = obj;

        strHtml +=
          `
          <div>
            <a href=/pages/chat/chat.html?negoid=${negoid}&title=${title}>
              ${title}
            </a>
          </div>
        `;
      });
    }
    document.getElementById("data").innerHTML = strHtml;

  });

window.goToHomePage = userService.goToHomePage;

