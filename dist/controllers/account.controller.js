"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePinHandler = exports.withdrawMoneyHandler = exports.transferMoneyHandler = exports.sendMoneyHandler = exports.depositMoneyHandler = exports.getUserAccountHandler = void 0;
const account_service_1 = require("../services/account.service");
const common_1 = require("../interfaces/common");
const interceptors_1 = require("../interceptors");
/**
 * Get a particular user account
 * @param req Request
 * @param res Response
 */
const getUserAccountHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield account_service_1.getUserAccount(req.params.id);
        if (!result.error) {
            yield interceptors_1.storeDataInCacheMemory(req, result);
        }
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.getUserAccountHandler = getUserAccountHandler;
/**
 *  Deposit money
 * @param req Request
 * @param res Response
 */
const depositMoneyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, pin, userId } = req.body;
        const result = yield account_service_1.depositMoney({ userId, amount: parseFloat(amount), pin: parseFloat(pin) });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.depositMoneyHandler = depositMoneyHandler;
/**
 *  Send money
 * @param req Request
 * @param res Response
 */
const sendMoneyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, pin, userId, email } = req.body;
        const result = yield account_service_1.sendMoney({ amount: parseFloat(amount), pin: parseFloat(pin), userId, email });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.sendMoneyHandler = sendMoneyHandler;
/**
 *  Transfer money
 * @param req Request
 * @param res Response
 */
const transferMoneyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, pin, userId, accountNumber } = req.body;
        const result = yield account_service_1.transferMoney({ amount: parseFloat(amount), pin: parseFloat(pin), userId, accountNumber });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.transferMoneyHandler = transferMoneyHandler;
/**
 *  Withdraw money
 * @param req Request
 * @param res Response
 */
const withdrawMoneyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, pin, userId, accountNumber } = req.body;
        const result = yield account_service_1.withdrawMoney({ amount: parseFloat(amount), pin: parseFloat(pin), userId, accountNumber });
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.withdrawMoneyHandler = withdrawMoneyHandler;
/**
 * Update user's pin
 * @param req Request
 * @param res Response
 */
const updatePinHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, pin } = req.body;
        const result = yield account_service_1.updateAccountPin(userId, parseFloat(pin));
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.updatePinHandler = updatePinHandler;
