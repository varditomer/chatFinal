"use strict";
import { storageService } from '../../services/storage.service.js'
import { userService } from '../../services/user.service.js'

function continueNegotiation() {
  window.location.href =
    `/pages/negotiation/continue-negotiation/continue-negotiation.html?username=?` +
    storageService.load("loggedInUser").username;
}

// Expose the continueNegotiation & logout functions to the global scope
window.continueNegotiation = continueNegotiation;
window.logout = userService.logout;
