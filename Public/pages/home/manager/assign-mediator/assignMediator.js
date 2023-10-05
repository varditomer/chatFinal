"use strict";

import { userService } from "../../../../services/user.service.js";

loadMediatorsUnassignedNegotiations()


let selectedNegotiationId

function loadMediatorsUnassignedNegotiations() {

  const yourUrl = "/api/negotiation/getUnassignedNegotiations";
  const titles = ['num', 'Title', 'Description', 'Topic Description', ''];

  fetch(yourUrl)
    .then((res) => res.json())
    .then((res) => {
      let strHtml = "";
      const unassignedNegotiations = res;
      if (unassignedNegotiations.length === 0) {
        strHtml +=
          `
          <h5 style="display: flex; gap: 10px; align-items: center; font-size: 20px; justify-content: center;">
          <i class="fas fa-thumbs-up"></i>
            There are no unassigned negotiations
          </h5>
        `;
      } else {
        // Load the list of mediators to populate assign mediator modal
        loadMediators();

        strHtml += /*html*/ `
          <h5 style="display: flex; gap: 10px; align-items: center; font-size: 28px; justify-content: center; margin-bottom: 20px">
              <i class="fas fa-user-check"></i>
              Assign mediator for unassigned negotiations
          </h5>
          <div class="table-container" style="color: black; padding: 20px;">
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
            </div>
          `;
        unassignedNegotiations.forEach((negotiation, index) => {
          const { title, description, topicDescription } = negotiation;
          strHtml += /*html*/ `
              <div class="row">
                  <div class="cell" data-title="${titles[0]}">
                      ${index + 1}
                  </div>
                  <div class="cell" data-title="${titles[1]}">
                      ${title}
                  </div>
                  <div class="cell" data-title="${titles[2]}">
                      ${description}
                  </div>
                  <div class="cell" data-title="${titles[3]}">
                      ${topicDescription}
                  </div>
                  <div class="cell" style="justify-content:center;" data-title="${titles[4]}">
                      <button type="button" class="btn" style="color:white;" onclick="assignMediator('${negotiation.negoid}');">Assign Mediator</button>
                  </div>
              </div>
              `;
        });
        strHtml += `</div>`
      }

      document.getElementById("data").innerHTML = strHtml;

    });
}


function loadMediators() {
  const url = '/api/mediator/getMediators';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('mediatorList');
      data.forEach(mediator => {
        const option = document.createElement('option');
        option.value = mediator.userCode;
        option.textContent = `${mediator.firstName} ${mediator.lastName} (${mediator.expertiseName})`;
        option.dataset.expertiseCode = mediator.expertiseCode;  // Setting expertise code as a data attribute
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching mediators:', error));
}

function assignMediator(negotiationID) {
  // Save the negotiationID to the global variable for later use
  selectedNegotiationId = negotiationID;

  // Open the modal
  openModal();
}

function openModal() {
  document.getElementById('mediatorModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('mediatorModal').style.display = 'none';
}

function submitMediatorAssignment() {
  const mediatorList = document.getElementById('mediatorList');
  const selectedMediatorUserCode = mediatorList.value;

  // Getting the selected option element
  const selectedOption = mediatorList.options[mediatorList.selectedIndex];
  const mediatorExpertiseCode = selectedOption.dataset.expertiseCode;  // Retrieving expertise code from data attribute

  const url = '/api/negotiation/assignMediator';

  const data = {
    negotiationID: selectedNegotiationId,
    mediatorUserCode: selectedMediatorUserCode,
    mediatorExpertiseCode  // Including mediator expertise code
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      alert('Mediator and topic assigned successfully');
      closeModal();
      location.reload()
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Expose the new functions to the global scope
window.goToHomePage = userService.goToHomePage
window.openModal = openModal;
window.closeModal = closeModal;
window.loadMediators = loadMediators;
window.assignMediator = assignMediator;
window.submitMediatorAssignment = submitMediatorAssignment;
