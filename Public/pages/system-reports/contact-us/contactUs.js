import { userService } from "../../../services/user.service.js";

const yourUrl = "/api/contact-us";
{/* <table id="data" style="margin-left:auto; font-size:15px; margin-right:auto; color:black;overflow:auto; width:100%;"></table> */}
fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    let strHtml = "";
    strHtml += /*html*/ `
  
          <table id="data">
            <tr class="row header">
              <th class="cell">Num</th>
              <th class="cell">Name</th>
              <th class="cell">Email</th>
              <th class="cell">Phone</th>
              <th class="cell">Subject</th>
              <th class="cell">Description</th>
              <th class="cell">User Type</th>
              <th class="cell">Username</th>
              <th class="cell">Date</th>
            </tr>
            `;

    let myarray = res;

    myarray.forEach((obj, idx) => {
      let { firstName, lastName, mail, phone, subject, description, userType, username, created_at } = obj;
      strHtml += /*html*/ `
            <tr class="row">
              <td data-title="Num" class="cell">${idx + 1} </td>           
              <td data-title="Name" class="cell">${firstName} ${lastName}</td>
              <td data-title="Email" class="cell">${mail}</td>
              <td data-title="Phone" class="cell">${phone}</td>
              <td data-title="Subject" class="cell">${subject}</td>
              <td data-title="Description" class="cell">${description}</td>
              <td data-title="User Type" class="cell">${userType}</td>
              <td data-title="Username" class="cell">${username}</td>
              <td data-title="Date" class="cell">${created_at.substring(0,10)}</td>
            </tr>
              `;
    });

    strHtml += /*html*/ `
            <button class="btn" onclick="exportTableToExcel('data')">Export Table Data To Excel File</button>        
                `;

    document.getElementById("data1").innerHTML = strHtml;
  });

  function exportTableToExcel(tableID, filename = "") {
    console.log(`tableID:`, tableID)
    let downloadLink;
    let dataType = "application/vnd.ms-excel";
    let tableSelect = document.getElementById(tableID);
    let tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");
    console.log(`tableSelect:`, tableSelect)
  console.log(`tableHTML:`, tableHTML)
  
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

window.exportTableToExcel = exportTableToExcel;
window.goToHomePage = userService.goToHomePage;
