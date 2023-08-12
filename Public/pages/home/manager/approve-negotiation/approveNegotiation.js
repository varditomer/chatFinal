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

const yourUrl = "/api/negotiation/viewNegotiation";

fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    var strHtml = "";
    strHtml += /*html*/ `
            <table border="2" width="200"  style="margin-left:auto; font-size:20px; margin-right:auto;">
            <tr style="color:darkblue; font-size:25px">
              <th >Title</th>
               <th>Description </th>
               <th>Mediator</th>
            </tr>
              `;
              

    var myarray = res;
    myarray.forEach((obj, i) => {
      let { negoid, title, description } = obj;
      // var name=obj.username;
      strHtml += /*html*/ `
              
<tr>
  
              <td>${title} </td>           
              <td>${description}</td>
          <td>    <select id="mediators${i}"></select></td>
          
          
           <td><button id="mediators${i}" style="margin:0 5px;" onclick="assignmediator(this.id,${negoid}  )" >Assign </button></td>
           

            </tr>

        
             
      
              `;
      fetch("/api/approvedMed")
        .then((res) => res.json())
        .then((res) => {
          var arr = [];
          var userArray = res;
          let arr1 = userArray.map(function (element) {
            return element.username;
          });

          myarray.forEach((item, i) => {
            const selectEl = document.getElementById(`mediators${i}`);
            const options = arr1
              .map((item) => /*html*/ `<option>${item}</option>`)
              .join("");
            selectEl.innerHTML = options;
          });
        });
    });
    document.getElementById("data").innerHTML = strHtml;
  });

function assignmediator(id, negoid) {
  console.log(id, negoid);
  var select = document.getElementById(id).value;
  const yourUrl = "/api/assignmedi";
  const object = {
    username: select,
    negoid: negoid,
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(object));
  window.location.href = "../approveNegotiation/approveNegotiation.html";
}

/////////////////////////////////

//           function assignmediator(id, negoid ){
//             src="https://smtpjs.com/v3/smtp.js"
//             const yourUrl = 'http://localhost:3000/api/assignmedi'
//             const object = { //put here relavent
//               username:document.getElementById(id).value,
//               negoid:negoid
//                           }
//             var xhr = new XMLHttpRequest();
//             xhr.open("POST", yourUrl, true);
//             xhr.setRequestHeader('Content-Type', 'application/json');
//             xhr.send(JSON.stringify(object));
//             alert("The assigenment has been done ");
//           }
//           </script>
