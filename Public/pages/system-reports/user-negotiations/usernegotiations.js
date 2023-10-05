import { userService } from "../../../services/user.service.js";
const yourUrl = "/api/admin/query2";

// Fetch data from the specified URL and parse it as JSON
fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    let strHtml = ""; // Initialize an empty string to store the HTML table structure
    strHtml += /*html*/ `
      <table id="data" border="2" style="margin-left:auto; font-size:15px; margin-right:auto; color:black; overflow:auto; width:100%">
        <tr class="row header">
          <th class="cell">#</th>
          <th class="cell">User Code</th>
          <th class="cell">First Name</th>
          <th class="cell">Last Name</th>
          <th class="cell">User Type</th>
          <th class="cell">Number of Negotiation</th>
        </tr>
    `; // Add table headers to the HTML structure

    // Iterate through the fetched user data and generate rows for the HTML table
    res.forEach((obj, idx) => {
      let { userCode, firstName, lastName, userType, Num } = obj; // Destructure user object properties
      strHtml += /*html*/ `
        <tr class="row">
          <td data-title="#" class="cell">${idx + 1}</td>
          <td data-title="User Code" class="cell">${userCode}</td>
          <td data-title="First Name" class="cell">${firstName}</td>
          <td data-title="Last Name" class="cell">${lastName}</td>
          <td data-title="User Type" class="cell">${userType}</td>
          <td data-title="Number Of Negotiation" class="cell">${Num}</td>
        </tr>
      `; // Add user data to the HTML structure row by row
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
    let blob = new Blob(["\ufeff", tableHTML], {
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
