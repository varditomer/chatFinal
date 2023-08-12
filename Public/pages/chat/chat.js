import { userService } from "../../../services/user.service.js";

function end() {
  var params = new URLSearchParams(url.search);
  var negoid = params.get("negoid");
  const yourUrl = "/api/endnego";
  const object1 = {
    //put here relavent

    negoid: negoid,
    name: localStorage.getItem("username"),
  };
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      if (xhr.responseText === "no") {
        alert("You are not a mediator");
      } else {
        window.location.href = `../fidbecnego/fidbecnego.html?negoid=` + negoid;
      }
    }
  };
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(object1));
}


function insti() {
  const yourUrl = "/api/checkinsti";
  const object1 = {
    // Put your relevant properties here
    name: localStorage.getItem("username")
  };

  fetch(yourUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(object1)
  })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then(responseText => {
      if (responseText === "no") {
        alert("You are not a mediator");
      } else {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const negoid = params.get("negoid");
        window.open(`../writeinsight/writeinsight.html?negoid=` + negoid);
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });
}

window.goToHomePage = userService.goToHomePage;

