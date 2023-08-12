function submit() {
  const yourUrl = "http://localhost:3000/api/addinsight";
  let params = new URL(document.location).searchParams;
  let negoid = params.get("negoid");
  // const urlSearchParams = url.searchParams

  // var params = new URLSearchParams(url.search);
  //     var negoid = params.get("negoid");
  console.log(negoid);
  const object = {
    //put here relavent

    negoid: negoid,
    insight: document.getElementById("insight").value,
    username: localStorage.getItem("username"),
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(object));
  alert(
    "Your insight is saved, you can return to the chat and continue negotiation"
  );
}

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
