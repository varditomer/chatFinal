import { userService } from "../../services/user.service";


const yourUrl = "/api/insight/getInsights/";

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    var strHtml = "";
    strHtml += /*html*/ `
            <table id="data" border="6" style="margin-left:auto; font-size:10px; margin-right:auto;">
              <tr>
                <th>Mediator</th>
                <th>Title</th>
                <th>Insight</th>
              </tr>
              `;

    var myarray = res;
    myarray.forEach((obj) => {
      let { username, title, content } = obj;
      strHtml += /*html*/ `
            <tr>
              <td>${username} </td>           
              <td>${title}</td>
              <td>${content}</td>
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
//link help me: https://www.codexworld.com/export-html-table-data-to-excel-using-javascript/

window.goToHomePage = userService.goToHomePage
