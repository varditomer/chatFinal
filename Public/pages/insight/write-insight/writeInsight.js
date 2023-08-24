import { userService } from "../../../services/user.service.js";

function addInsight() {
  const yourUrl = "/api/insight/addInsight";
  const params = new URL(document.location).searchParams;
  const negotiationTitle = params.get("negotiationTitle");
  const insightContent = document.getElementById("insightContent").value
  const username = userService.getLoggedInUser().username

  const insightToAdd = {
    title: negotiationTitle,
    content: insightContent,
    username
  };

  fetch(yourUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(insightToAdd),
  })
    .then((response) => {
      if (response.ok) {
        alert(
          "Your insight is saved, you can return to the chat and continue negotiation"
        );
      } else {
        console.error("Failed to save insight");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const updateNegotiationTitle = () => {
  const params = new URL(document.location).searchParams;
  const negotiationTitle = params.get("negotiationTitle");
  document.querySelector('.negotiation-title').textContent = `Negotiation: ${negotiationTitle}`
}

window.goToHomePage = userService.goToHomePage;
window.addInsight = addInsight
window.updateNegotiationTitle = updateNegotiationTitle

