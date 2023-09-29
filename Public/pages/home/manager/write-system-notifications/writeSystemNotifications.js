// Fetch the user data from the API
fetch('/api/admin/getUsers')
.then(response => response.json())
    .then(users => {
      const usernameSelect = document.getElementById('username');
      let lastUserType = '';
      
      users.forEach((user, index) => {
        // Handle the first group title separately
        if (index === 0) {
          const groupTitle = document.createElement('option');
          groupTitle.disabled = true;
          groupTitle.textContent = user.userType.charAt(0).toUpperCase() + user.userType.slice(1) + 's';  // Capitalize userType
          usernameSelect.appendChild(groupTitle);
        }
        
        // If the userType has changed, add a separator and a new group title
        if (lastUserType && lastUserType !== user.userType) {
          const separator = document.createElement('option');
          separator.disabled = true;
          separator.textContent = '──────────';
          usernameSelect.appendChild(separator);

          const groupTitle = document.createElement('option');
          groupTitle.disabled = true;
          groupTitle.textContent = user.userType.charAt(0).toUpperCase() + user.userType.slice(1) + 's';  // Capitalize userType
          usernameSelect.appendChild(groupTitle);
        }
        
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = `${user.firstName} ${user.lastName}`;
        usernameSelect.appendChild(option);
        
        lastUserType = user.userType;
      });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });



function sendNotification() {
  const yourUrl = "/api/notification/sendNotification";
  const notificationDetails = {
      username: document.getElementById("username").value,
      notification: document.getElementById("notification").value,
  };

  console.log(`notificationDetails:`, notificationDetails)


  fetch(yourUrl, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationDetails),
  })
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error("Failed to send notification");
      }
  })
  .then(data => {
      console.log(data);
      alert("Your notification has been sent");
      window.location.href = "../manager-page.html";
  })
  .catch(error => {
      console.error(error);
      alert("An error occurred while sending the notification");
  });
}

function goToHomePage() {
    const userType = JSON.parse(localStorage.getItem("loggedInUser")).userType;
    if (userType === "mediator") {
        window.location.href = "/pages/home/mediator/mediator-page.html";
    } else if (userType === "negotiator") {
        window.location.href = "/pages/home/negotiator/negotiator-page.html";
    } else if (userType === "manager") {
        window.location.href = "/pages/home/manager/manager-page.html";
    }
  }

