function goBackToLastURL() {
    const referrer = document.referrer;
    if (referrer) {
      window.location.href = referrer;
    } else {
      console.warn("No referrer found. Can't navigate back.");
      // Optionally, navigate to a fallback URL or display a message to the user
      // window.location.href = '/fallback-url';
    }
  }