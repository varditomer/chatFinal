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
const yourUrl = "/api/query1";

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    var strHtml = "";
    strHtml += /*html*/ `
              
       

            <table id="data" border="6" style="margin-left:auto; font-size:10px; margin-right:auto;">
            <tr>
              <th>First Name</th>
               <th>Last Name</th>
               <th>Username</th>
               <th>User Type</th>
               <th>Phone</th>
               <th>Education</th>
               <th>Professional Experience</th>
  
            </tr>
              
           
      
              `;

    var myarray = res;
    myarray.forEach((obj) => {
      let {
        firstName,
        lastName,
        username,
        userType,
        phone,
        education,
        proffesionalExperience,
      } = obj;
      var name = obj.username;
      strHtml += /*html*/ `
            <tr>
              <td>${firstName} </td>           
              <td>${lastName}</td>
              <td>${username}</td>
              <td>${userType}</td>
              <td> ${phone}</td>
              <td>${education}</td>
              <td>${proffesionalExperience}</td>
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
