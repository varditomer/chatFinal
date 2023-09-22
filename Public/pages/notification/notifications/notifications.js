import { userService } from "../../../services/user.service.js";

function read(notificationId) {

  // Your API endpoint for reading
  const yourApiUrl = "/api/notification/markNotificationAsSeen";

  // Use fetch to make a POST request
  fetch(yourApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notificationId }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        console.error("Error:", res.error);
      } else {
        // Request was successful
        alert("Notification has been read");
        window.location.href = "./notifications.html";
      }
    })
    .catch(error => {
      // Handle fetch error
      console.error("Fetch error:", error);
    });
}


const user = userService.getLoggedInUser()
const titles = ['#', 'Notification', '']
const yourUrl = "/api/notification/getNotifications/" + user.userCode;

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    var strHtml = "";
    const notifications = res;
    console.log("check");
    console.log(notifications);
    if (notifications.length === 0) {
      strHtml +=
        `
                <h5>
                You have no new notifications</h5>
 
                `;
    }else{
      strHtml+=`     <div class="row header">
      <div key={title} class="cell">
          ${titles[0]}
      </div>
      <div key={title} class="cell">
          ${titles[1]}
      </div>
      <div  key={title} class="cell">
          ${titles[2]}
      </div>
      </div>`
    }

    notifications.forEach((notification, idx) => {
      let { id, content } = notification;
      strHtml +=
        `
        <div class="row">
          <div class="cell" data-title=${titles[0]}>
            ${idx + 1}
          </div>
          <div class="cell" data-title=${titles[1]}>
            ${(content)}
          </div>
          <div style="align-items: center;display:flex;justify-content:center" class="cell capitalize" data-title=${titles[2]}>
            <button type="submit" style="color:white" onclick="read('${id}');"><img src="/assets/images/correct_icon.png" width="20"></button>
          </div>
          </div>
          `
    });
    document.querySelector(".table-container").innerHTML = strHtml;
  });

window.goToHomePage = userService.goToHomePage
window.read = read
