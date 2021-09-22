"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const common_1 = require("../middlewares/common");
const interceptors_1 = __importDefault(require("../interceptors"));
const transaction_validator_1 = require("../validators/transaction.validator");
const common_validator_1 = require("../validators/common.validator");
const transaction_controller_1 = require("../controllers/transaction.controller");
const route = express_1.Router();
/**
 * Get a single user transaction
 */
route.get(`/transactions/*user/:id`, common_1.authVerifyUser, validator_middleware_1.validate(common_validator_1.validateUserId), interceptors_1.default, transaction_controller_1.getUserTransactionsHandler);
/**
 * Get a transaction details
 */
route.get(`/transactions/:id`, common_1.authVerifyUser, validator_middleware_1.validate(transaction_validator_1.validateTransactionId), interceptors_1.default, transaction_controller_1.getATransactionHandler);
/**
 * Get all transactions
 */
route.get(`/transactions`, common_1.authVerifyUser, common_1.checkPermission, interceptors_1.default, transaction_controller_1.getAllTransactionsHandler);
exports.default = route;
