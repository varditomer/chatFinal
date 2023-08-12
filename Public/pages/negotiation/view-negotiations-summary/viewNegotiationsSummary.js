import { userService } from "../../../services/user.service.js";

const username = userService.getLoggedInUser().username;

const yourUrl = "/api/negotiation/query8/" + username;

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    console.log(`res:`, res)
    var strHtml = "";
    strHtml += /*html*/ `
            <table id="data" border="6" style="margin-left:auto; font-size:10px; margin-right:auto;">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>End time</th>
                <th>Summary</th>
              </tr>
            `;

    const negotiationsSummary = res;
    negotiationsSummary.forEach((obj) => {
      let { title, description, endTime, summary } = obj;
      strHtml += /*html*/ `
            <tr>
              <td>${title} </td>           
              <td>${description}</td>
              <td>${endTime}</td>
              <td>${summary}</td>
            </tr>
              `;
    });
    strHtml += /*html*/ `
            <CENTER><button onclick="exportTableToExcel('data')">Export Table Data To Excel File</button>        
                `;
    document.getElementById("data1").innerHTML = strHtml;
  });

function approvenMed(name) {
  const yourUrl = "/api/approvenMed";
  const object = {
    username: name,
  };
  console.log(object.username);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(object));
}

function exportTableToExcel(tableID, filename = "") {
  var downloadLink;
  var dataType = "application/vnd.ms-excel";
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

  // Specify file name
  filename = filename ? filename + ".xls" : "excel_data.xls";

  // Create download link element
  downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(["\ufeff", tableHTML], {
      type: dataType,
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = "data:" + dataType + ", " + tableHTML;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }
}
window.goToHomePage = userService.goToHomePage