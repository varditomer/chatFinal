"use strict";

import { userService } from "../../../../services/user.service.js";

const yourUrl = "/api/mediator/getUnapprovedMediators";

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    var strHtml = "";
    strHtml += /*html*/ `

        <h5 style="display: flex; gap: 10px; align-items: center; font-size: 28px; justify-content: center; margin-bottom: 20px">
          <i class="fas fa-user-check"></i>
          Unassigned negotiations
        </h5>

            <table border="6" style="margin-left:auto; font-size:15px; margin-right:auto;">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>User Name</th>
                <th>Education</th>
                <th>Professional Experience</th>
              </tr>
              `;

    var unApprovedMediators = res;
    unApprovedMediators.forEach((mediator) => {
      const { firstName, lastName, username, education, professionalExperience } = mediator;
      strHtml += /*html*/ `
            <tr>
              <td>${firstName} </td>           
              <td>${lastName}</td>
              <td> ${username}</td>
              <td>${education}</td>
              <td>${professionalExperience}</td>
              <td>
                <center>
                  <button type="submit" class="btn" style="color:white" onclick="approveMediator('${mediator.username}');">Approve</button>
                </center>
              </td>
            </tr>
              `;
    });

    //console.log(strHtml);
    document.getElementById("data").innerHTML = strHtml;
  });

function approveMediator(username) {
  const yourUrl = "/api/mediator/approveMediator";
  const mediatorUsername = { username };

  fetch(yourUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mediatorUsername),
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        // Handle error cases
        console.error("Error approving mediator:", res.error);
      } else {
        // Request was successful, refresh page
        console.log(`res.username:`, res.username)
        window.location.href = "./approve-mediator.html";
      }
    })
    .catch(error => {
      // Handle fetch error
      console.error("Fetch error:", error);
    });
}


window.goToHomePage = userService.goToHomePage
window.approveMediator = approveMediator

