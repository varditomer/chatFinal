import { userService } from "../../../services/user.service.js";

// Function to add insight to the negotiation
function addInsight() {
  // URL to send the POST request
  const yourUrl = "/api/insight/addInsight";

  // Extract negotiation title and insight content from the page
  const params = new URL(document.location).searchParams;
  const negotiationTitle = params.get("negotiationTitle");
  const insightContent = document.getElementById("insightContent").value;

  // Get the username of the logged-in user
  const username = userService.getLoggedInUser().username;

  // Prepare the insight data to be sent in the request body
  const insightToAdd = {
    title: negotiationTitle,
    content: insightContent,
    username
  };

  // Send a POST request to save the insight
  fetch(yourUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(insightToAdd),
  })
    .then((response) => {
      console.log(`response:`, response)
      if (response.ok) {
        alert("Your insight is saved, you can return to the chat and continue negotiation");
      } else {
        console.error("Failed to save insight");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to update the negotiation title on the page
const updateNegotiationTitle = () => {
  const params = new URL(document.location).searchParams;
  const negotiationTitle = params.get("negotiationTitle");
  document.querySelector('.negotiation-title').textContent = `Negotiation: ${negotiationTitle}`;
}

// Expose functions to the global scope
window.goToHomePage = userService.goToHomePage;
window.addInsight = addInsight;
window.updateNegotiationTitle = updateNegotiationTitle;
