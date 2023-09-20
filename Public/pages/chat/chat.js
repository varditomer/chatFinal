// Function to end a negotiation
function endConflict() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser.userType !== 'mediator') return
  // Extract parameters from the URL query string
  const params = new URLSearchParams(url.search);
  const negoid = params.get("negoid");

  // Define the URL for the API endpoint
  const yourUrl = "/api/negotiation/endNegotiation";

  // Create an object with relevant data to send in the request
  const negotiationDetails = {
    negoid: negoid,
  };

  // Use the Fetch API to send a POST request to the API
  fetch(yourUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(negotiationDetails),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then((responseText) => {
      if (responseText === "no") {
        alert("You are not a mediator");
      } else {
        // Redirect to a new page with the negotiation ID
        window.location.href = `../negotiation/feedback-negotiation/feedback-negotiation.html?negoid=` + negoid;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}


// Function to write insights
function writeInsight() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser.userType !== 'mediator') return
  console.log(`negoid:`, negoid)
  return window.open(`../insight/write-insight/write-insight.html?negotiationTitle=` + negoid);
}

// Export the functions to make them accessible in the global window object
window.endConflict = endConflict
window.writeInsight = writeInsight