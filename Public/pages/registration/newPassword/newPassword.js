function newpass() {
  const yourUrl = "/api/resetpass";
  const object = {
    //put here relavent
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  console.log(object);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(object));
  alert("The password has been changed");
}
