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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawMoney = exports.transferMoney = exports.sendMoney = exports.depositMoney = exports.updateAccountPin = exports.getUserAccount = exports.createAccount = void 0;
const common_1 = require("../interfaces/common");
const account_model_1 = __importDefault(require("../models/account.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const event_manager_1 = __importDefault(require("../events/event.manager"));
const helper_util_1 = require("../utils/helper.util");
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
const createAccount = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield account_model_1.default.create(Object.assign(Object.assign({}, body), { pin: 1234 }));
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { statusCode: 201, message: "Account created successfully" });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.createAccount = createAccount;
/**
 * Fetch a particular user wallet details
 * @param user_id of a user
 * @returns IResultType
 */
const getUserAccount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let wallet = yield account_model_1.default.findOne({ userId }, '-__v -_id -pin').lean().exec();
        if (!wallet) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No wallet found", statusCode: 404 });
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [wallet] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.getUserAccount = getUserAccount;
const updateAccountPin = (userId, pin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let wallet = yield account_model_1.default.findOne({ userId }).lean().exec();
        if (!wallet) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No wallet found", statusCode: 404 });
        }
        yield account_model_1.default.findOneAndUpdate({ userId }, { pin }, { useFindAndModify: false });
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [], message: 'Your pin is updated successfully' });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.updateAccountPin = updateAccountPin;
/**
 * Deposit money
 * @param user_id of a user
 * @returns IResultType
 */
const depositMoney = ({ userId, amount, pin }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let account = yield account_model_1.default.findOne({ userId });
        if (!account) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No wallet found", statusCode: 404 });
        }
        if (pin === 1234 || account.pin !== pin) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: pin === 1234 ? "Change your default pin" : "Invalid pin, please try again", statusCode: 401 });
        }
        const balance = account.balance;
        const total = balance + amount;
        if (total > 1000000) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "Deposit error, maximum amount is 1 million", statusCode: 406 });
        }
        const update = yield account_model_1.default.findOneAndUpdate({ userId }, { $inc: { balance: amount } });
        // emit event to update user points as well
        if (update) {
            // emit event to update user points wallets
            const points = helper_util_1.getDepositPoint(amount);
            event_manager_1.default.emit('update_user_points', { points, userId });
            // emit event to save transaction history event
            event_manager_1.default.emit('save_transaction', { fromUser: userId, toUser: userId, amount, type: 'account', eventType: 'deposit' });
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { message: "Wallet funded successfully", data: [Object.assign(Object.assign({}, update), { balance: total })] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.depositMoney = depositMoney;
/**
 * Send money to user's wallet account
 * @param user_id of a user
 * @returns IResultType
 */
const sendMoney = ({ userId, email, pin, amount }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get current user's account details
        const account = yield account_model_1.default.findOne({ userId });
        if (!account) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "Your account is not found", statusCode: 404 });
        }
        if (pin === 1234 || account.pin !== pin) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: pin === 1234 ? "Change your default pin" : "Invalid pin, please try again", statusCode: 401 });
        }
        const balance = account.balance;
        if ((balance < amount)) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "Transfer error, you don't have enough fund", statusCode: 406 });
        }
        const currentBalance = balance - amount;
        // get the receiver
        let user = yield user_model_1.default.findOne({ email: helper_util_1.caseInsensitive(email) });
        if (!user) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No user found", statusCode: 404 });
        }
        // update the receiver's balance
        const update = yield account_model_1.default.findOneAndUpdate({ userId: user._id }, { $inc: { balance: amount } }, { useFindAndModify: false });
        if (update) {
            // debit the sender's account
            yield account_model_1.default.findOneAndUpdate({ userId }, { balance: currentBalance }, { useFindAndModify: false });
            // emit transfer event
            event_manager_1.default.emit('save_transaction', { fromUser: userId, toUser: user._id, amount, type: 'account', eventType: 'send' });
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { message: 'Money sent successfully', data: [{ _id: userId, balance: currentBalance }] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.sendMoney = sendMoney;
/**
 * Transfer money
 * @param user_id of a user
 * @returns IResultType
 */
const transferMoney = ({ userId, accountNumber, pin, amount }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let account = yield account_model_1.default.findOne({ userId });
        if (!account) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No account found", statusCode: 404 });
        }
        if (pin === 1234 || account.pin !== pin) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: pin === 1234 ? "Change your default pin" : "Invalid pin, please try again", statusCode: 401 });
        }
        const balance = account.balance;
        if ((balance < amount)) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "Transfer error, you don't have enough fund", statusCode: 406 });
        }
        const currentBalance = balance - amount;
        // debit current user account
        yield account_model_1.default.findOneAndUpdate({ userId }, { balance: currentBalance }, { useFindAndModify: false });
        // here you can make the withdrawal to the account or emit an event to handle it
        // emit transfer event
        event_manager_1.default.emit('save_transaction', { fromUser: userId, toUser: userId, amount, type: 'account', eventType: 'transfer' });
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { message: "Transfer successful", data: [{ _id: userId, balance: currentBalance }] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.transferMoney = transferMoney;
/**
 * Deposit money
 * @param user_id of a user
 * @returns IResultType
 */
const withdrawMoney = ({ userId, pin, amount }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let account = yield account_model_1.default.findOne({ userId });
        if (!account) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No account found", statusCode: 404 });
        }
        if (pin === 1234 || account.pin !== pin) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: pin === 1234 ? "Change your default pin" : "Invalid pin, please try again", statusCode: 401 });
        }
        const balance = account.balance;
        if ((balance < amount)) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "Withdrawal error, you don't have enough fund", statusCode: 406 });
        }
        const currentBalance = balance - amount;
        // debit current user account
        yield account_model_1.default.findOneAndUpdate({ userId }, { balance: currentBalance }, { useFindAndModify: false });
        // here you can make the withdrawal to the account or emit an event to handle it
        // emit transfer event
        event_manager_1.default.emit('save_transaction', { fromUser: userId, toUser: userId, amount, type: 'account', eventType: 'withdrawal' });
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { message: "Withdrawal successful", data: [{ _id: userId, balance: currentBalance }] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.withdrawMoney = withdrawMoney;
