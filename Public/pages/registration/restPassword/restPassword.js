"use strict";
function sendEmail() {
  // src = "https://smtpjs.com/v3/smtp.js";
  const yourUrl = "/api/resetpassword";
  const object = {
    //put here relavent
    email: document.getElementById("mail").value,
  };

  console.log(object);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // הודעה כאשר האימייל נשלח בהצלחה
        alert("Check your mail box");
      } else if (xhr.status === 404) {
        // הודעה כאשר כתובת האימייל אינה קיימת במערכת
        alert("Email address does not exist");
      } else {
        // הודעה כללית לשגיאה בשליחת האימייל
        alert("An error occurred while sending the email");
      }
    }
  };
  xhr.send(JSON.stringify(object));
}
