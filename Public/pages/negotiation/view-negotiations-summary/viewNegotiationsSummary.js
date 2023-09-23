import { userService } from "../../../services/user.service.js";

const username = userService.getLoggedInUser().username;

const yourUrl = "/api/negotiation/negotiationSummary/" + username;

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    console.log(`res:`, res)
    var strHtml = "";
    strHtml += /*html*/ `
            <table id="data">
              <tr class="row header">
                <th class="cell">Title</th>
                <th class="cell">Description</th>
                <th class="cell">End time</th>
                <th class="cell">Summary</th>
              </tr>
            `;

    const negotiationsSummary = res;
    negotiationsSummary.forEach((obj) => {
      let { title, description, endTime, summary } = obj;
      strHtml += /*html*/ `
            <tr class="row">
              <td class="cell">${title} </td>           
              <td class="cell">${description}</td>
              <td class="cell">${endTime}</td>
              <td class="cell">${summary}</td>
            </tr>
              `;
    });
    strHtml += /*html*/ `
            <CENTER><button onclick="exportTableToExcel('data')">Export Table Data To Excel File</button>        
                `;
    document.getElementById("data1").innerHTML = strHtml;
  });

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
window.exportTableToExcel = exportTableToExcel
