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
    if (notifications.length === 0) {
      strHtml +=
      `
        <h5 style="display: flex; gap: 10px; align-items: center; font-size: 20px; justify-content: center;">
          <i class="fas fa-bell" style="color: red; text-decoration: line-through; text-decoration-color: black;"></i>
          You have no unread notifications
        </h5>
      `;
    } else {

      strHtml += 
        `
          <h5 style="display: flex; gap: 10px; align-items: center; font-size: 20px; justify-content: center;">
            <i class="fas fa-bell"></i>
            Please check unread notifications
          </h5>
          <div class="table-container" style="color: black; padding: 20px;">
            <div class="row header">
              <div key={title} class="cell" style="flex-basis: 10%;">
                  ${titles[0]}
              </div>
              <div key={title} class="cell">
                  ${titles[1]}
              </div>
              <div  key={title} class="cell" style="flex-basis: 10%;">
                  ${titles[2]}
              </div>
            </div>
        `
    }

    notifications.forEach((notification, idx) => {
      let { id, content } = notification;
      strHtml +=
          `
            <div class="row">
              <div style="font-weight:600; flex-basis: 10%;" class="cell" data-title=${titles[0]} >
                ${idx + 1}
              </div>
              <div class="cell" data-title=${titles[1]} style="font-size: 20px">
                ${(content)}
              </div>
              <div style="align-items: center; display: flex; justify-content: center; flex-basis: 10%;" class="cell capitalize" data-title=${titles[2]}>
                <button type="submit" style="border: none; background: transparent; color: #1E3050" onclick="read('${id}');"><i class="fas fa-check-square"></i></button>
              </div>
            </div>
          `
    });

    strHtml += `</div>`
    console.log(`strHtml:`, strHtml)
    document.querySelector(".main-content").innerHTML = strHtml;
  });

window.goToHomePage = userService.goToHomePage
window.read = read
