async function addSummary() {
  const yourUrl = "/api/negotiation/addSummary";
  var url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const negoid = params.get("negoid");
  console.log(negoid);

  const negotiationDetails = {
    negoid: negoid,
    summary: document.getElementById("summary").value,
  };

  try {
    const response = await fetch(yourUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(negotiationDetails)
    });

    if (!response.ok) {
      // handle HTTP-level error
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.href = "/pages/home/mediator/mediator-page.html";
  } catch (error) {
    console.error("There was a problem with the fetch:", error);
  }
}

window.addSummary = addSummary;
