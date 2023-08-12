function goToHomePage() {
  var userType = localStorage.getItem("userType");
  if (userType === "mediator") {
    window.location.href = "../mediatorPage/mediatorPage.html";
  } else if (userType === "negotiator") {
    window.location.href = "../negotiatorPage/negotiatorPage.html";
  } else if (userType === "manager") {
    window.location.href = "../managerPage/managerPage.html";
  }
}

function goToPage() {
  window.location.href = "../viewSystemReports/viewSystemReports.html";
}

const yourUrl = "/api/query2";

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    var strHtml = "";
    strHtml += /*html*/ `
              
       

            <table id="data" border="6" style="margin-left:auto; font-size:15px; margin-right:auto;">
            <tr>
              <th>User Code</th>
               <th>First Name</th>
               <th>Last Name</th>
               <th>User Type</th>
               <th>Number of negotiation</th>
 

  
            </tr>
              
           
      
              `;

    var myarray = res;

    myarray.forEach((obj) => {
      let { userCode, firstName, lastName, userType, Num } = obj;
      var name = obj.username;
      strHtml += /*html*/ `
              
<tr>
              <td>${userCode} </td>           
              <td>${firstName}</td>
              <td>${lastName}</td>
              <td>${userType}</td>

              <td> ${Num}</td>
         

            </tr>

        
             
      
              `;
    });

    //console.log(strHtml);
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
//link help me: https://www.codexworld.com/export-html-table-data-to-excel-using-javascript/
