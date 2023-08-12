"use strict";
import { userService } from '../../../services/user.service.js'

// Expose the logout function to the global scope
window.logout = userService.logout;
