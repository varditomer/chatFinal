"use strict";

async function sendEmail() {
    const yourUrl = "/api/auth/resetpassword";
    const object = {
        email: document.getElementById("mail").value,
    };

    try {
        const response = await fetch(yourUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
        });

        if (response.ok) {
            alert("Check your mail box");
            window.location.href = '/index.html';
        } else if (response.status === 404) {
            alert("Email address does not exist");
        } else {
            alert("An error occurred while sending the email");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred while sending the email");
    }
}
