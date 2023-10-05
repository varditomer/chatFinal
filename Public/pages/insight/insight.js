import { userService } from "../../services/user.service.js";


const yourUrl = "/api/insight/getInsights/";

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    let strHtml = "";
    const insights = res
    if (!insights.length) {
      strHtml += `
      <h5 style="display: flex; gap: 10px; align-items: center; font-size: 28px; justify-content: center;">
      <i class="fas fa-gavel" style="color: red; text-decoration: line-through; text-decoration-color: black;"></i>
        You have no Insights
      </h5>
      `
        ;
    } else {
      strHtml += /*html*/ `
            <table class="table-container" id="data">
              <tr class="row header">
                <th class="cell">Mediator</th>
                <th class="cell">Title</th>
                <th class="cell">Insight</th>
              </tr>
              `;

      let myarray = res;
      myarray.forEach((obj) => {
        let { username, title, content } = obj;
        strHtml += /*html*/ `
            <tr class="row">
              <td data-title="User Name" class="cell" >${username} </td>           
              <td data-title="Title" class="cell">${title}</td>
              <td data-title="Content" class="cell">${content}</td>
            </tr>
            `;
      });
      strHtml += /*html*/ `
            <button class="btn" onclick="exportTableToExcel('data')">Export Table Data To Excel File</button>        
                `;
    }
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

window.goToHomePage = userService.goToHomePage
window.exportTableToExcel = exportTableToExcel
