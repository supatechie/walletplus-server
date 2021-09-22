"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const common_1 = require("../middlewares/common");
const account_validator_1 = require("../validators/account.validator");
const account_controller_1 = require("../controllers/account.controller");
const interceptors_1 = __importDefault(require("../interceptors"));
const route = express_1.Router();
/**
 * Get a single user account
 */
route.get(`/accounts/*user/:id`, common_1.authVerifyUser, interceptors_1.default, account_controller_1.getUserAccountHandler);
/**
 * Deposit money
 */
route.post(`/deposit`, common_1.authVerifyUser, validator_middleware_1.validate(account_validator_1.validateDepositInput), account_controller_1.depositMoneyHandler);
/**
 * Send money
 */
route.post(`/send`, common_1.authVerifyUser, validator_middleware_1.validate(account_validator_1.validateSendInput), account_controller_1.sendMoneyHandler);
/**
 * Transfer money
 */
route.post(`/transfer`, common_1.authVerifyUser, validator_middleware_1.validate(account_validator_1.validateAccountInput), account_controller_1.transferMoneyHandler);
/**
 * Withdraw money
 */
route.post(`/withdraw`, common_1.authVerifyUser, validator_middleware_1.validate(account_validator_1.validateAccountInput), account_controller_1.withdrawMoneyHandler);
/**
 * Update pin
 */
route.patch(`/change_pin`, common_1.authVerifyUser, validator_middleware_1.validate(account_validator_1.validatePinInput), account_controller_1.updatePinHandler);
exports.default = route;
