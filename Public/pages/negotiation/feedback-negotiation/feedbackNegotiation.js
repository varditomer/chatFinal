

function submit() {
  const yourUrl = "/api/addsummary";
  let params = new URL(document.location).searchParams;
  let negoid = params.get("negoid");
  // const urlSearchParams = url.searchParams

  // var params = new URLSearchParams(url.search);
  //     var negoid = params.get("negoid");
  console.log(negoid);
  const object = {
    //put here relavent

    negoid: negoid,
    summary: document.getElementById("summary").value,
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(object));
  window.location.href = "../mediatorPage/mediatorPage.html";
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
