"use strict";
import { userService } from './services/user.service.js'

// Expose the submit function to the global scope
window.login = userService.login;
