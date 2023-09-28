import { userService } from "../../../services/user.service.js";

const yourUrl = "/api/admin/query1";

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    let strHtml = "";
    strHtml += /*html*/ `
            <table id="data" border="2" style="margin-left:auto; width:100%; border-collapse:collapse;border:2px solid black; margin-top:20px; font-size:20px; margin-right:auto;">
            <tr class="row header">
              <th class="cell">First Name</th>
               <th class="cell">Last Name</th>
               <th class="cell">Username</th>
               <th class="cell">User Type</th>
               <th class="cell">Phone</th>
            </tr>
              `;

    res.forEach((obj) => {
      let {
        firstName,
        lastName,
        username,
        userType,
        phone,
      } = obj;
      strHtml += /*html*/ `
            <tr class="row">
              <td class="cell">${firstName} </td>           
              <td class="cell">${lastName}</td>
              <td class="cell">${username}</td>
              <td class="cell">${userType}</td>
              <td class="cell"> ${phone}</td>
            </tr>
            `;
    });
    strHtml += /*html*/ `
            <button onclick="exportTableToExcel('data')">Export Table Data To Excel File</button>        
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
