import { userService } from "../../../services/user.service.js";

const yourUrl = "/api/admin/query5";

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    let strHtml = "";
    strHtml += /*html*/ `
           <table id="data" border="2" style="margin-left:auto; font-size:15px; margin-right:auto; color:black;overflow:auto">
            <tr class="row header">
              <th class="cell">#</th>
              <th class="cell">Negotiation ID</th>
               <th class="cell">Title</th>
               <th class="cell">Description</th>
               <th class="cell">Start time</th>
               <th class="cell">End time</th>
            </tr>
              `;

    let myarray = res;
    myarray.forEach((obj, i) => {
      let { negoid, title, description, startTime, endTime } = obj;
      strHtml += /*html*/ `
            <tr class="row">
              <td data-title="#" class="cell">${i + 1} </td>           
              <td data-title="Negotiation ID" class="cell">${negoid} </td>           
              <td data-title="Title" class="cell">${title}</td>
              <td data-title="Description" class="cell">${description}</td>
              <td data-title="Start Time" class="cell">${startTime.substring(0, 10)} ${startTime.substring(11, 16)}</td>
              <td data-title="End Time" class="cell">${endTime.substring(0, 10)} ${endTime.substring(11, 16)}</td>
            </tr>
            `;
    });

    strHtml += /*html*/ `
              <button style="width:250px" onclick="exportTableToExcel('data')">Export Table Data To Excel File</button>        
                `;

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
