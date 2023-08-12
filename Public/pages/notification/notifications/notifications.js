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
        /*html*/
        `<div><center>
                <h5>
                You have no new notifications</h5>
                `;
    }

    notifications.forEach((notification) => {
      let { id, content } = notification;
      strHtml += /*html*/ `<div>
                <div>
                  <h6>#${content}
                  <button type="submit"  style="color:white" onclick="read('${id}');"><img src="/assets/images/correct_icon.png" width="20"></button></h6>
                  <br>
                </div>
              </div>`;
    });

    console.log(strHtml);
    document.getElementById("data").innerHTML = strHtml;
  });

window.goToHomePage = userService.goToHomePage
window.read = read
