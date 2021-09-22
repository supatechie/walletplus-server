"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transactionService = __importStar(require("../../src/services/transaction.service"));
// @ts-ignore
const jest_helper_1 = require("../jest.helper");
jest.mock('../../src/services/transaction.service');
describe("Testing createTransaction function", () => {
    test("should return Point wallet created successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Transaction inserted successfully" };
        const payload = { fromUser: "dhj", toUser: "jdhdhdg", eventType: 'deposit', type: 'account' };
        const mockCreatePoint = jest_helper_1.mockFunction(transactionService.createTransaction);
        const response = mockCreatePoint.mockResolvedValue(result);
        const res = yield response(payload);
        expect(res.error).toBeFalsy();
    }));
    test("should return number of times called", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCreatePoint = jest_helper_1.mockFunction(transactionService.createTransaction);
        const payload = { fromUser: "dhj", toUser: "jdhdhdg", eventType: 'deposit', type: 'account' };
        mockCreatePoint(payload);
        expect(mockCreatePoint).toBeCalledTimes(2);
        expect(mockCreatePoint.name).toBe('createTransaction');
    }));
});
describe("Testing getATransaction function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Success", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Success" };
        const mockGetATransaction = jest_helper_1.mockFunction(transactionService.getATransaction);
        const response = mockGetATransaction.mockResolvedValueOnce(result);
        const res = yield response('shdkakdj');
        expect(res.message).toBe("Success");
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGetATransaction = jest_helper_1.mockFunction(transactionService.getATransaction);
        mockGetATransaction('dhdgs');
        expect(mockGetATransaction).toBeCalledTimes(1);
        expect(mockGetATransaction.name).toBe('getATransaction');
        expect(mockGetATransaction).toBeCalledWith('dhdgs');
    }));
});
describe("Testing getTransactions function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Success", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Success" };
        const mockGetTransactions = jest_helper_1.mockFunction(transactionService.getTransactions);
        const response = mockGetTransactions.mockResolvedValueOnce(result);
        const res = yield response({}, {});
        expect(res.message).toBe("Success");
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGetTransactions = jest_helper_1.mockFunction(transactionService.getTransactions);
        mockGetTransactions({}, {});
        expect(mockGetTransactions).toBeCalledTimes(1);
        expect(mockGetTransactions.name).toBe('getTransactions');
    }));
});
