"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middleware_1 = require("../middlewares/user.middleware");
const user_validator_1 = require("../validators/user.validator");
const user_controller_1 = require("../controllers/user.controller");
const route = express_1.Router();
/**
 * Create a new user
 */
route.post(`/user`, user_middleware_1.validate(user_validator_1.validateUserInput), user_controller_1.createUserHandler);
/**
 * Get all users
 */
route.get(`/users`, user_controller_1.getAllUsersHandler);
/**
 * Get a user
 */
route.get(`/users/:user_id`, user_controller_1.getUserHandler);
/**
 * Sign in a user
 */
route.post(`/login`, user_middleware_1.validate(user_validator_1.validateSignInput), user_controller_1.loginHandler);
/**
* Refresh auth token
*/
route.post(`/refresh_token`, user_controller_1.refreshAuthTokenHandler);
exports.default = route;
