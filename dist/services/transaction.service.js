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
exports.getTransactions = exports.getATransaction = exports.createTransaction = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../interfaces/common");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
const createTransaction = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield transaction_model_1.default.create(body);
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { statusCode: 201, message: "Transaction inserted successfully" });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.createTransaction = createTransaction;
/**
 * Fetch a particular user wallet details
 * @param user_id of a user
 * @returns IResultType
 */
const getATransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _id = new mongoose_1.SchemaTypes.ObjectId(id);
        let res = yield transaction_model_1.default.findOne({ _id }).lean().exec();
        if (!res) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No transaction found", statusCode: 404 });
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [Object.assign(Object.assign({}, res), { _id: res._id.toString() })] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.getATransaction = getATransaction;
/**
 *  Get transactions
 * @returns IResultType
 */
const getTransactions = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield transaction_model_1.default.countDocuments(query).exec();
        const data = yield transaction_model_1.default.find(query, {}, options).populate('fromUser', 'email _id firstName').populate('toUser', 'email _id firstName').lean().exec();
        if (data.length < 1) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No transaction found", statusCode: 404 });
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [{ total, transactions: data }] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.getTransactions = getTransactions;
