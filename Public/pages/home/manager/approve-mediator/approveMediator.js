"use strict";

import { userService } from "../../../../services/user.service.js";

const yourUrl = "/api/mediator/getUnapprovedMediators";
const titles = ['First Name', 'Last Name', 'User Name', 'Education', 'Professional Experience', '']
fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    var strHtml = "";
    strHtml += /*html*/ `

              <div class="row header">
              <div class="cell">
                  ${titles[0]}
              </div>
              <div class="cell">
                  ${titles[1]}
              </div>
              <div class="cell">
                  ${titles[2]}
              </div>
              <div class="cell">
                  ${titles[3]}
              </div>
              <div class="cell">
                  ${titles[4]}
              </div>
              <div class="cell">
                  ${titles[5]}
              </div>
            </div>

              `;

    var unApprovedMediators = res;
    unApprovedMediators.forEach((mediator) => {
      const { firstName, lastName, username, education, professionalExperience } = mediator;
      strHtml += /*html*/ `
   <div class="row">
   <div style="font-weight:600;color:black" class="cell" data-title=${titles[0]}>
     ${firstName}
   </div>
   <div style="color:black"   class="cell" data-title=${titles[1]}>
     ${lastName}
   </div>
   <div style="color:black"  class="cell capitalize" data-title=${titles[2]}>
    ${username}
   </div>
   <div style="color:black"  class="cell" data-title=${titles[3]}>
     ${education}
   </div>
   <div style="color:black" class="cell capitalize" data-title=${titles[4]}>
     ${professionalExperience}  
   </div>
   <div style="color:black;justify-content:center;"  class="cell">
     <button type="submit" class="btn" style="color:white;height:40px" onclick="approveMediator('${mediator.username}');">Approve</button>
   </div>
</div>


`;
    });
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

