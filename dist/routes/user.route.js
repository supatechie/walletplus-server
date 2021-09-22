"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const common_1 = require("../middlewares/common");
const user_validator_1 = require("../validators/user.validator");
const user_controller_1 = require("../controllers/user.controller");
const interceptors_1 = __importDefault(require("../interceptors"));
const route = express_1.Router();
/**
 * Create a new user
 */
route.post(`/register`, validator_middleware_1.validate(user_validator_1.validateUserInput), common_1.rateLimiter, user_controller_1.createUserHandler);
/**
 * Sign in a user
 */
route.post(`/login`, validator_middleware_1.validate(user_validator_1.validateSignInput), user_controller_1.loginHandler);
/**
 * Get all users
 */
route.get(`/users`, common_1.authVerifyUser, common_1.checkPermission, interceptors_1.default, user_controller_1.getAllUsersHandler);
/**
 * Get a user
 */
route.get(`/users/:user_id`, common_1.authVerifyUser, interceptors_1.default, user_controller_1.getUserHandler);
/**
 * Refresh auth token
 */
route.get(`/refresh_token`, user_controller_1.refreshAuthTokenHandler);
/**
 * Logout user
 */
route.get(`/logout`, user_controller_1.logoutHandler);
exports.default = route;
