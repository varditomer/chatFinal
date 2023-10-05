async function validateForm() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("newPassword");
  const repeatPasswordInput = document.getElementById("repeatPassword");
  const resetCode = document.getElementById("resetCode");
  // Reset error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => {
    errorMessage.textContent = "";
  });

  let isValid = true;
  
  // Validate username
  if (usernameInput.value.trim() === "") {
    document.getElementById("error-username").textContent =
      "Please enter a username";
    isValid = false;
  }

  // Validate password
  if (passwordInput.value.trim() === "") {
    document.getElementById("error-new-password").textContent =
      "Please enter a password";
    isValid = false;
  }
  
  // Validate repeat password
  if (repeatPasswordInput.value.trim() === "") {
    document.getElementById("error-repeat-password").textContent =
      "Please repeat password";
    isValid = false;
  }

  // Validate passwords equal
  if (passwordInput.value.trim() !== repeatPasswordInput.value.trim()) {
    document.getElementById("error-repeat-password").textContent =
      "Passwords aren't match";
    isValid = false;
  }

  // Validate reset code
  if (resetCode.value.trim() === "") {
    document.getElementById("error-reset-code").textContent =
      "Please enter a reset code";
    isValid = false;
  }

  // --------------------------

  // Validating email & username isn't already in use
  const isEmailOrUsernameExist = await _isEmailOrUsernameExist(null, usernameInput.value)
  if (!isEmailOrUsernameExist?.valid) {
    document.getElementById("error-username").textContent = "Username isn't exist";
    isValid = false;
  }

  return isValid;
}

async function _isEmailOrUsernameExist(emailInput, usernameInput) {
  try {
    const response = await fetch("/api/auth/checkUserExists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailInput, username: usernameInput }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const user = await response.json();
    if (user) {
      return { valid: true };
    } else {
      return { valid: false, type: "username" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { valid: false };
  }
}


async function newPassword() {
  const isValidForm = await validateForm();
  if (!isValidForm) return;

  const yourUrl = "/api/auth/resetpass";
  const userNewCredentials = {
    username: document.getElementById("username").value,
    newPassword: document.getElementById("newPassword").value,
    resetCode: document.getElementById("resetCode").value,
  };
console.log(`userNewCredentials:`, userNewCredentials)
  try {
    const response = await fetch(yourUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userNewCredentials)
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.error || `Network response was not ok: ${response.statusText}`;
      alert(errorMessage);
      throw new Error(errorMessage);
    } else {
      alert('The password has been changed');
      window.location.href = '/index.html';
    }

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}
