"use strict";

async function validateForm() {
  const firstNameInput = document.getElementById("firstname");
  const lastNameInput = document.getElementById("lastname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const experienceInput = document.getElementById("professionalDescription");
  const isTermsApproved = document.getElementById("termsPrivacy").checked;

  // Reset error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => {
    errorMessage.textContent = "";
  });

  let isValid = true;
  
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
  // Validate experience
  if (experienceInput.value.trim() === "") {
    document.getElementById("error-experience").textContent =
      "Please enter your's professional experience";
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
  if (isValidForm) {
    const yourUrl = "/api/auth/signupMedi";
    const userDetails = {
      firstName: document.getElementById("firstname").value,
      lastName: document.getElementById("lastname").value,
      email: document.getElementById("email").value,
      username: document.getElementById("username").value,
      phone: document.getElementById("phone").value,
      education: document.getElementById("education").value,
      userType: "mediator",
      password: document.getElementById("password").value,
      professionalExperience: document.getElementById("professionalDescription").value,
      expertiseCode: document.getElementById("expertise").value
    };
    console.log(`userCredentials:`, userDetails);

    fetch(yourUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then(response => {
        if (response.ok) {
          console.log(`ok:`,)
          alert("Registered successfully");
          window.location.href = "../../../../index.html";
        } else {
          alert("Registration failed");
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
}

// Function to populate the expertise select dropdown
function populateExpertise(expertise) {
  console.log(`expertise:`, expertise)
  const expertiseSelect = document.getElementById("expertise");

  expertise.forEach(e => {
    const option = document.createElement("option");
    option.value = e.expertiseCode;
    option.textContent = e.name;
    expertiseSelect.appendChild(option);
  });
}

// Fetch negotiation expertise and populate the select dropdown
const topicsUrl = "/api/expertise/getExpertise";
fetch(topicsUrl, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then(res => res.json())
  .then(res => {
    if (!res.error) {
      populateExpertise(res);
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

