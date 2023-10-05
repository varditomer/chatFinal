import { userService } from "../../../services/user.service.js";

const yourUrl = "/api/admin/query1";

// Make a GET request to the specified URL to fetch user data
fetch(yourUrl)
  .then((res) => res.json()) // Parse the response as JSON
  .then((res) => {
    console.log(res); // Log the fetched data to the console for debugging purposes
    let strHtml = ""; // Initialize an empty string to store the HTML table structure
    strHtml += /*html*/ `
      <table id="data" border="2" style="margin-left:auto; width:100%; border-collapse:collapse;border:2px solid black; margin-top:20px; font-size:20px; margin-right:auto;">
        <tr class="row header">
          <th class="cell">#</th>
          <th class="cell">First Name</th>
          <th class="cell">Last Name</th>
          <th class="cell">Username</th>
          <th class="cell">User Type</th>
          <th class="cell">Phone</th>
        </tr>
    `; // Add table headers to the HTML structure

    // Iterate through the fetched user data and generate rows for the HTML table
    res.forEach((obj, idx) => {
      let { firstName, lastName, username, userType, phone } = obj; // Destructure user object properties
      strHtml += /*html*/ `
        <tr class="row">
          <td class="cell">${idx + 1}</td>
          <td class="cell">${firstName}</td>
          <td class="cell">${lastName}</td>
          <td class="cell">${username}</td>
          <td class="cell">${userType}</td>
          <td class="cell">${phone}</td>
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


window.exportTableToExcel = exportTableToExcel
window.goToHomePage = userService.goToHomePage
