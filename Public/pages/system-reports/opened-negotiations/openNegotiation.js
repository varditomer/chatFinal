import { userService } from "../../../services/user.service.js";

const yourUrl = "/api/admin/query4";

// Make a GET request to fetch data from the specified URL
fetch(yourUrl)
  .then((res) => res.json()) // Parse the response as JSON
  .then((res) => {
    let strHtml = ""; // Initialize an empty string to store the HTML table structure
    strHtml += /*html*/ `
      <table id="data" style="margin-left:auto; font-size:15px; margin-right:auto;">
        <tr class="row header">
          <th class="cell">Num</th>
          <th class="cell">Negotiation ID</th>
          <th class="cell">Title</th>
          <th class="cell">Description</th>
          <th class="cell">Start time</th>
        </tr>
    `; // Add table headers to the HTML structure

    let myArray = res; 
    myArray.forEach((obj, i) => {
      let { negoid, title, description, startTime } = obj; // Destructure negotiation object properties
      strHtml += /*html*/ `
        <tr class="row">
          <td data-title="Num" class="cell">${i + 1}</td>
          <td data-title="Negotiation ID" class="cell">${negoid}</td>
          <td data-title="Title" class="cell">${title}</td>
          <td data-title="Description" class="cell">${description}</td>
          <td data-title="Start time" class="cell">${startTime.substring(0, 10)} ${startTime.substring(11, 16)}</td>
        </tr>
      `; // Add negotiation data to the HTML structure row by row
    });

    strHtml += /*html*/ `
      <button class="btn" onclick="exportTableToExcel('data')">Export Table Data To Excel File</button>
    `; // Add a button to export the table data to an Excel file

    // Insert the generated HTML table structure and export button into the element with id "data1"
    document.getElementById("data1").innerHTML = strHtml;
  });




function exportTableToExcel(tableID, filename = "") {
  let downloadLink;
  let dataType = "application/vnd.ms-excel";
  let tableSelect = document.getElementById(tableID);
  let tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

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

window.exportTableToExcel = exportTableToExcel
window.goToHomePage = userService.goToHomePage