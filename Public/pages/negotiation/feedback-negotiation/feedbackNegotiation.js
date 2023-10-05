/**
 * Async function to add a summary to a negotiation.
 */
async function addSummary() {
  // API endpoint for adding a summary
  const yourUrl = "/api/negotiation/addSummary";

  // Get negotiation ID from the URL query parameters
  var url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const negoid = params.get("negoid");

  // Create an object with negotiation details including the summary from the input field
  const negotiationDetails = {
    negoid: negoid,
    summary: document.getElementById("summary").value,
  };

  try {
    // Make a POST request to the server with the negotiation details
    const response = await fetch(yourUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(negotiationDetails)
    });

    // Check if the response is successful, otherwise handle HTTP-level error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Redirect to the mediator's home page after successfully adding the summary
    window.location.href = "/pages/home/mediator/mediator-page.html";
  } catch (error) {
    // Handle any errors that occurred during the fetch operation
    console.error("There was a problem with the fetch:", error);
  }
}

// Expose the addSummary function to the global scope
window.addSummary = addSummary;
