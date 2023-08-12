
import { userService } from '../../services/user.service.js'

const loggedInUser = userService.getLoggedInUser()


document.getElementById("Subject").value = ''
document.getElementById("firstname").value = loggedInUser.firstName
document.getElementById("lastname").value = loggedInUser.lastName
document.getElementById("mail").value = loggedInUser.email
document.getElementById("phone").value = loggedInUser.phone


function validateForm() {
  const firstNameInput = document.getElementById("firstname");
  const lastNameInput = document.getElementById("lastname");
  const emailInput = document.getElementById("mail");
  const phoneInput = document.getElementById("phone");
  const subjectInput = document.getElementById("Subject");
  const descriptionInput = document.getElementById("description");

  // Reset error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => {
    errorMessage.textContent = "";
  });

  let isValid = true;

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

    // Validate subject
  if (subjectInput.value.trim() === "") {
    document.getElementById("error-subject").textContent =
      "Please select a subject";
    isValid = false;
  }


  // Validate description
  if (descriptionInput.value.trim() === "") {
    document.getElementById("error-description").textContent =
      "Please enter a description";
    isValid = false;
  }

  return isValid;
}

function sendEmail() {
  const isValidForm = validateForm();
  if (isValidForm) {
    const yourUrl = "/api/email/sendEmail";
    const appeal = {
      firstName: document.getElementById("firstname").value,
      lastName: document.getElementById("lastname").value,
      mail: document.getElementById("mail").value,
      phone: document.getElementById("phone").value,
      subject: document.getElementById("Subject").value,
      description: document.getElementById("description").value,
      userType: loggedInUser.userType
    };
    console.log(`appeal:`, appeal)

    fetch(yourUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appeal)
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then(() => {
        alert("Your request has been sent");
        userService.goToHomePage();
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
  }
}

window.sendEmail = sendEmail;
window.goToHomePage = userService.goToHomePage


