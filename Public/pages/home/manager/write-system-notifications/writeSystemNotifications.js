function goToHomePage() {
  const userType = JSON.parse(localStorage.getItem("loggedInUser")).userType;
  if (userType === "mediator") {
      window.location.href = "/pages/home/mediator/mediator-page.html";
  } else if (userType === "negotiator") {
      window.location.href = "/pages/home/negotiator/negotiator-page.html";
  } else if (userType === "manager") {
      window.location.href = "/pages/home/manager/manager-page.html";
  }
}



function sendNotification() {
  const yourUrl = "/api/notification/sendNotification";
  const notificationDetails = {
      username: document.getElementById("username").value,
      notification: document.getElementById("notification").value,
  };

  console.log(`notificationDetails:`, notificationDetails)


  fetch(yourUrl, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationDetails),
  })
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error("Failed to send notification");
      }
  })
  .then(data => {
      console.log(data);
      alert("Your notification has been sent");
      window.location.href = "../manager-page.html";
  })
  .catch(error => {
      console.error(error);
      alert("An error occurred while sending the notification");
  });
}

