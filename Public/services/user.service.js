import { storageService } from "./storage.service.js"

function login() {
    const yourUrl = "/api/auth/login"; // URL for the login endpoint
    const userCredentials = {
        userName: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    // Send a POST request to the login endpoint
    fetch(yourUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Set the content type to JSON
        },
        body: JSON.stringify(userCredentials) // Convert userCredentials to JSON and send as the request body
    })
        .then(res => {
            return res.json(); // Parse the response body as JSON
        })
        .then(res => {
            if (res.error) {
                throw new Error(res.error); // If there's an error in the response, throw an error
            } else {
                return res; // Otherwise, return the response data
            }
        })
        .then(data => {
            // Process the response data
            // Save user ID when logging in to the web
            storageService.save("loggedInUser", data);

            if (data.userType === "mediator") {
                window.location.href = "/pages/home/mediator/mediator-page.html"; // Redirect to mediator page
            } else if (data.userType === "negotiator") {
                window.location.href = "/pages/home/negotiator/negotiator-page.html"; // Redirect to negotiator page
            } else if (data.userType === "manager") {
                window.location.href = "/pages/home/manager/manager-page.html"; // Redirect to manager page
            } else if (data === "no") {
                document.getElementById("message").textContent =
                    "Wrong password, try again"; // Display error message for incorrect password
            }
        })
        .catch(error => {
            document.getElementById('message').innerText = error.message
        });
}


function logout() {
    storageService.remove('loggedInUser')
    window.location.href = '/index.html'
}

function getLoggedInUser() {
    return storageService.load("loggedInUser")
}

function goToHomePage() {
    const userType = storageService.load("loggedInUser").userType;
    if (userType === "mediator") {
        window.location.href = "/pages/home/mediator/mediator-page.html";
    } else if (userType === "negotiator") {
        window.location.href = "/pages/home/negotiator/negotiator-page.html";
    } else if (userType === "manager") {
        const urlPath = window.location.pathname
        if (urlPath === "/pages/system-reports/print-users-list/printuserslist.html" || urlPath === "/pages/system-reports/opened-negotiations/openNegotiation.html" || urlPath === "/pages/system-reports/finished-negotiations/finishednegotiation.html"|| urlPath=== "/pages/usernegotiations/usernegotiations.html") {
            window.location.href = "/pages/system-reports/viewSystemReports.html"
        }
        else window.location.href = "/pages/home/manager/manager-page.html"; // Redirect to manager page
    }
}


export const userService = {
    login,
    logout,
    getLoggedInUser,
    goToHomePage
}
