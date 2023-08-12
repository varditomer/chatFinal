"use strict";
async function validateForm() {
  const firstNameInput = document.getElementById("firstname");
  const lastNameInput = document.getElementById("lastname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("Phone");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const isTermsApproved = document.getElementById("termsPrivacy").checked;


  // Reset error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => {
    errorMessage.textContent = "";
  });

  let isValid = true;

  // ------------------------------------------

  // Validate Terms Approved
  if (!isTermsApproved) {
    document.getElementById("error-terms").textContent =
      "Please confirm terms and privacy";
    isValid = false;
  }

  // Validate first name
  if (firstNameInput.value.trim() === "") {
    document.getElementById("error-firstname").textContent =
      "Please enter your first name";
    isValid = false;
  }

  // Validate last name
  if (lastNameInput.value.trim() === "") {
    document.getElementById("error-lastname").textContent =
      "Please enter your last name";
    isValid = false;
  }

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value)) {
    document.getElementById("error-email").textContent =
      "Please enter a valid email address";
    isValid = false;
  }

  // Validate phone
  if (
    phoneInput.value.replace(/-/g, "").length !== 10 ||
    isNaN(phoneInput.value.replace(/-/g, ""))
  ) {
    document.getElementById("error-phone").textContent =
      "Please enter a valid 10-digit phone number";
    isValid = false;
  }

  // Validate username
  if (usernameInput.value.trim() === "") {
    document.getElementById("error-username").textContent =
      "Please enter a username";
    isValid = false;
  }
  // Validate password
  if (passwordInput.value.trim() === "") {
    document.getElementById("error-password").textContent =
      "Please enter a password";
    isValid = false;
  }

  // --------------------------

  // Validating email & username isn't already in use
  const isEmailOrUsernameExist = await _isEmailOrUsernameExist(emailInput.value, usernameInput.value)
  console.log(`isEmailOrUsernameExist:`, isEmailOrUsernameExist)
  if (!isEmailOrUsernameExist.valid) {
    if (isEmailOrUsernameExist.type === 'email') document.getElementById("error-email").textContent = "Email already in use";
    else document.getElementById("error-username").textContent = "Username already in use";
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
      // If user object exists, check if the email or username already exists
      if (user.email === emailInput) {
        // If the email already exists
        return { valid: false, type: "email" };
      } else if (user.username === usernameInput) {
        // If the username already exists
        return { valid: false, type: "username" };
      }
    }

    return { valid: true };
  } catch (error) {
    console.error("Error:", error);
    return { valid: false };
  }
}



async function submit() {
  const isValidForm = await validateForm();
  console.log(`isValidForm:`, isValidForm)
  if (isValidForm) {
    const yourUrl = "/api/auth/signupNego";
    const userDetails = {
      firstName: document.getElementById("firstname").value,
      lastName: document.getElementById("lastname").value,
      email: document.getElementById("email").value,
      username: document.getElementById("username").value,
      phone: document.getElementById("Phone").value,
      userType: "negotiator",
      password: document.getElementById("password").value,
    };

    console.log(userDetails);

    fetch(yourUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data here if needed
        alert("Registered successfully!");
        // Optionally, redirect to another page after successful registration
        window.location.href = "../../../../index.html";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
      });
  }
}

