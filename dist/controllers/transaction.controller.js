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
exports.getAllTransactionsHandler = exports.getATransactionHandler = exports.getUserTransactionsHandler = void 0;
const transaction_service_1 = require("../services/transaction.service");
const common_1 = require("../interfaces/common");
const interceptors_1 = require("../interceptors");
/**
 * Get a particular user transactions
 * @param req Request
 * @param res Response
 */
const getUserTransactionsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transaction_service_1.getTransactions({ $or: [
                {
                    fromUser: req.params.id
                },
                {
                    toUser: req.params.id
                }
            ],
        }, { limit: 50, sort: { createdAt: -1 } });
        if (!result.error) {
            yield interceptors_1.storeDataInCacheMemory(req, result);
        }
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.getUserTransactionsHandler = getUserTransactionsHandler;
/**
 * Get a single transaction details
 * @param req Request
 * @param res Response
 */
const getATransactionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transaction_service_1.getATransaction(req.params.id);
        if (!result.error) {
            yield interceptors_1.storeDataInCacheMemory(req, result);
        }
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.getATransactionHandler = getATransactionHandler;
/**
 * Get all transactions
 * @param req Request
 * @param res Response
 */
const getAllTransactionsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transaction_service_1.getTransactions({}, { limit: 50, sort: { createdAt: -1 } });
        if (!result.error) {
            yield interceptors_1.storeDataInCacheMemory(req, result);
        }
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.getAllTransactionsHandler = getAllTransactionsHandler;
