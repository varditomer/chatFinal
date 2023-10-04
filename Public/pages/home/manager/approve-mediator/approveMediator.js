"use strict";

import { userService } from "../../../../services/user.service.js";

const yourUrl = "/api/mediator/getUnapprovedMediators";
const titles = ['First Name', 'Last Name', 'Expertise', 'Education', 'Professional Experience', '']
fetch(yourUrl)
  .then((res) => res.json())
  .then((res) => {
    let strHtml = "";
    var unApprovedMediators = res;
    if (unApprovedMediators.length === 0) {
      strHtml +=
        `
        <h5 style="display: flex; gap: 10px; align-items: center; font-size: 20px; justify-content: center;">
        <i class="fas fa-thumbs-up"></i>
          There are no mediators to approve
        </h5>
      `;
    } else {
      // Load the list of mediators to populate assign mediator modal
      loadExpertise();
      strHtml += /*html*/ `
              <h5 style="display: flex; gap: 10px; align-items: center; font-size: 28px; justify-content: center; margin-bottom: 20px">
                <i class="fas fa-check-double"></i>
                Approve mediators or edit expertise and approve
              </h5>
              <div class="row header">
              <div class="cell">
                  ${titles[0]}
              </div>
              <div class="cell">
                  ${titles[1]}
              </div>
              <div class="cell">
                  ${titles[2]}
              </div>
              <div class="cell">
                  ${titles[3]}
              </div>
              <div class="cell">
                  ${titles[4]}
              </div>
              <div class="cell">
                  ${titles[5]}
              </div>
            </div>

              `;
      console.log(`unApprovedMediators:`, unApprovedMediators)
      unApprovedMediators.forEach((mediator) => {
        const { firstName, lastName, username, expertiseName, education, professionalExperience, expertiseCode, expertiseDescription } = mediator;
        strHtml += /*html*/ `
            <div class="row">
              <div style="font-weight:600;color:black" class="cell" data-title=${titles[0]}>
                ${firstName}
              </div>
              <div style="color:black"   class="cell" data-title=${titles[1]}>
                ${lastName}
              </div>
              <div style="color:${expertiseCode ? 'black' : 'red'}"  class="cell capitalize" data-title=${titles[2]}>
                ${expertiseCode ? expertiseName : 'Undefined'}
              </div>
              <div style="color:black"  class="cell" data-title=${titles[3]}>
                ${education}
              </div>
              <div style="color:black" class="cell capitalize" data-title=${titles[4]}>
                ${professionalExperience}  
              </div>
              ${expertiseCode ?
            `
                    <div style="color:black;justify-content:center;"  class="cell">
                      <button type="submit" class="btn" style="color:white;height:40px" onclick="approveMediator('${username}');">Approve</button>
                    </div>
                  </div>
                `
            :
            `
                  <div style="color:black;justify-content:center;" class="cell">
                    <button type="submit" class="btn" style="color:white; height:40px; background-color: black" onclick="handleNewExpertise('${username}', '${expertiseDescription}')">Edit Expertise</button>
                  </div>
                </div>
                `
          }
      `;
      });
    }

    document.getElementById("data").innerHTML = strHtml;
  });

let usernameToAssign

function approveMediator(username) {
  const yourUrl = "/api/mediator/approveMediator";
  const mediatorUsername = { username };

  fetch(yourUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mediatorUsername),
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        // Handle error cases
        console.error("Error approving mediator:", res.error);
      } else {
        // Request was successful, refresh page
        window.location.href = "./approve-mediator.html";
      }
    })
    .catch(error => {
      // Handle fetch error
      console.error("Fetch error:", error);
    });
}

function handleNewExpertise(username, expertiseDescription) {
  const modalExpertiseDescription = document.getElementById('expertiseDescription')
  modalExpertiseDescription.value = expertiseDescription
  usernameToAssign = username

  // Open the modal
  openModal();
}

function openModal() {
  document.getElementById('mediatorModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('mediatorModal').style.display = 'none';
}

function loadExpertise() {
  const url = '/api/expertise/getExpertise';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('expertiseList');
      data.forEach(expertise => {
        const option = document.createElement('option');
        option.value = expertise.expertiseCode;
        option.textContent = expertise.name;
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching mediators:', error));
}

const handleNewExpertiseCheckbox = (event) => {
  const isEditingExpertise = event.target.checked;
  const expertiseInput = document.getElementById('expertiseDescription');
  expertiseInput.readOnly = !isEditingExpertise;
}

const submitMediatorApprovement = () => {
  approveMediator(usernameToAssign)
  assignMediatorExpertise()
}

function assignMediatorExpertise() {
  const isAddingNewExpertise = document.getElementById('newExpertiseCheckbox').checked;
  const expertiseDescriptionInput = document.getElementById('expertiseDescription');
  let expertiseData = {
    expertiseCode: null,
    expertiseName: null,
    username: usernameToAssign
  };

  if (isAddingNewExpertise) {
    expertiseData.expertiseName = expertiseDescriptionInput.value;
  } else {
    expertiseData.expertiseCode = document.getElementById('expertiseList').value;
  }

  fetch('/api/mediator/assignExpertise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expertiseData),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    window.location.reload()
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}




window.goToHomePage = userService.goToHomePage
window.approveMediator = approveMediator
window.openModal = openModal;
window.closeModal = closeModal;
window.handleNewExpertise = handleNewExpertise
window.handleNewExpertiseCheckbox = handleNewExpertiseCheckbox
window.submitMediatorApprovement = submitMediatorApprovement

