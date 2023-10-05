// Function to redirect users based on their userType stored in localStorage
function goToHomePage() {
  // Retrieve userType from localStorage
  let userType = localStorage.getItem("userType");
  // Redirect based on userType
  if (userType === "mediator") {
    window.location.href = "../mediatorPage/mediatorPage.html";
  } else if (userType === "negotiator") {
    window.location.href = "../negotiatorPage/negotiatorPage.html";
  } else if (userType === "manager") {
    window.location.href = "../managerPage/managerPage.html";
  }
}

// Fetch data from the API endpoint "/api/negotiation/viewNegotiation"
const yourUrl = "/api/negotiation/viewNegotiation";
fetch(yourUrl)
  .then((res) => res.json()) // Parse the response as JSON
  .then((res) => {
    let strHtml = ""; // Initialize an empty HTML string to construct the table
    strHtml += /*html*/ `
      <table border="2" width="200" style="margin-left:auto; font-size:20px; margin-right:auto;">
        <tr style="color:darkblue; font-size:25px">
          <th>Title</th>
          <th>Description</th>
          <th>Mediator</th>
        </tr>
    `;

    let myarray = res; // Store the API response in a variable
    myarray.forEach((obj, i) => {
      let { negoid, title, description } = obj; // Destructure object properties
      strHtml += /*html*/ `
        <tr>
          <td>${title}</td>
          <td>${description}</td>
          <td><select id="mediators${i}"></select></td>
          <td><button id="mediators${i}" style="margin:0 5px;" onclick="assignmediator(this.id,${negoid})">Assign</button></td>
        </tr>
      `;

      // Fetch approved mediator data from "/api/approvedMed"
      fetch("/api/approvedMed")
        .then((res) => res.json()) // Parse the response as JSON
        .then((res) => {
          let userArray = res.map((element) => element.username); // Extract usernames from the response
          const selectEl = document.getElementById(`mediators${i}`); // Get the select element by ID
          const options = userArray.map((item) => `<option>${item}</option>`).join(""); // Generate option elements
          selectEl.innerHTML = options; // Populate the select dropdown with options
        });
    });

    document.getElementById("data").innerHTML = strHtml; // Set the constructed HTML table to the element with id "data"
  });

  async function assignmediator(id, negoid) {
    try {
      // Get the selected mediator's username from the corresponding select dropdown
      let select = document.getElementById(id).value;
      
      // Prepare the object to be sent in the POST request
      const object = {
        username: select,
        negoid: negoid,
      };
      
      // Send a POST request to "/api/assignmedi" to assign the mediator
      const response = await fetch("/api/assignmedi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
      });
      
      if (response.ok) {
        // Redirect to the approveNegotiation page after assigning the mediator
        window.location.href = "../approveNegotiation/approveNegotiation.html";
      } else {
        console.error("Failed to assign mediator");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  

