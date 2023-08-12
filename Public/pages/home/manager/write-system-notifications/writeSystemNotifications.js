function goToHomePage() {
  var userType = localStorage.getItem("userType");
  if (userType === "mediator") {
    window.location.href = "../mediatorPage/mediatorPage.html";
  } else if (userType === "negotiator") {
    window.location.href = "../negotiatorPage/negotiatorPage.html";
  } else if (userType === "manager") {
    window.location.href = "../managerPage/managerPage.html";
  }
}

function sendnotifaiction() {
  src = "https://smtpjs.com/v3/smtp.js";
  const yourUrl = "http://localhost:3000/api/sendnotifaiction";
  const object = {
    //put here relavent
    username: document.getElementById("username").value,
    notification: document.getElementById("notification").value,
  };

  console.log(object);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(object));
  alert("Your notification has been sent ");
  window.location.href = "../managerPage/managerPage.html";
}
