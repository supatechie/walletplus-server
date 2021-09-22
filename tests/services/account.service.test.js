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
const accountService = __importStar(require("../../src/services/account.service"));
// @ts-ignore
const jest_helper_1 = require("../jest.helper");
jest.mock('../../src/services/account.service');
describe("Testing createAccount function", () => {
    test("should return Account created successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Account created successfully" };
        const payload = { balance: 5000, userId: "jdhdhdg", pin: 12345 };
        const mockCreateAccount = jest_helper_1.mockFunction(accountService.createAccount);
        const response = mockCreateAccount.mockResolvedValue(result);
        const res = yield response(payload);
        expect(res.error).toBeFalsy();
    }));
    test("should return number of times called", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCreateAccount = jest_helper_1.mockFunction(accountService.createAccount);
        const payload = { balance: 5000, userId: "jdhdhdg", pin: 12345 };
        mockCreateAccount(payload);
        expect(mockCreateAccount).toBeCalledTimes(2);
        expect(mockCreateAccount.name).toBe('createAccount');
    }));
});
describe("Testing getUserAccount function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Success", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Success" };
        const mockGetUserAccount = jest_helper_1.mockFunction(accountService.getUserAccount);
        const response = mockGetUserAccount.mockResolvedValueOnce(result);
        const res = yield response('shdkakdj');
        expect(res.message).toBe("Success");
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGetUserAccount = jest_helper_1.mockFunction(accountService.getUserAccount);
        mockGetUserAccount('dhdgs');
        expect(mockGetUserAccount).toBeCalledTimes(1);
        expect(mockGetUserAccount.name).toBe('getUserAccount');
        expect(mockGetUserAccount).toBeCalledWith('dhdgs');
    }));
});
describe("Testing updateAccountPin function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Your pin is updated successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Your pin is updated successfully" };
        const payload = ['shsh', 6738];
        const mockUpdateAccountPin = jest_helper_1.mockFunction(accountService.updateAccountPin);
        const response = mockUpdateAccountPin.mockResolvedValueOnce(result);
        const res = yield response(...payload);
        expect(res.message).toBe("Your pin is updated successfully");
    }));
    test("should return No wallet found", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: true, data: [], statusCode: 404, message: "No wallet found" };
        const payload = ['shsh', 6738];
        const mockUpdateAccountPin = jest_helper_1.mockFunction(accountService.updateAccountPin);
        const response = mockUpdateAccountPin.mockResolvedValueOnce(result);
        const res = yield response(...payload);
        expect(res.message).toBe("No wallet found");
        expect(res.error).toBeTruthy();
        expect(res.statusCode).toBe(404);
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = ['shsh', 6738];
        const mockUpdateAccountPin = jest_helper_1.mockFunction(accountService.updateAccountPin);
        mockUpdateAccountPin(...payload);
        expect(mockUpdateAccountPin).toBeCalledTimes(1);
        expect(mockUpdateAccountPin.name).toBe('updateAccountPin');
        expect(mockUpdateAccountPin).toBeCalledWith(...payload);
    }));
});
describe("Testing depositMoney function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Wallet funded successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Wallet funded successfully" };
        const payload = { userId: 'shsh', pin: 3738, amount: 5000 };
        const mockSendMoney = jest_helper_1.mockFunction(accountService.depositMoney);
        const response = mockSendMoney.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Wallet funded successfully");
    }));
    test("should return Invalid pin, please try again", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: true, data: [], statusCode: 401, message: "Invalid pin, please try again" };
        const payload = { userId: 'shsh', pin: 3738, amount: 5000 };
        const mockSendMoney = jest_helper_1.mockFunction(accountService.depositMoney);
        const response = mockSendMoney.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Invalid pin, please try again");
        expect(res.error).toBeTruthy();
        expect(res.statusCode).toBe(401);
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { userId: 'shsh', pin: 3738, amount: 5000 };
        const mockSendMoney = jest_helper_1.mockFunction(accountService.depositMoney);
        mockSendMoney(payload);
        expect(mockSendMoney).toBeCalledTimes(1);
        expect(mockSendMoney.name).toBe('depositMoney');
        expect(mockSendMoney).toBeCalledWith(payload);
    }));
});
describe("Testing sendMoney function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Money sent successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Money sent successfully" };
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, email: "demo@gmail.com" };
        const mockTransferMoney = jest_helper_1.mockFunction(accountService.sendMoney);
        const response = mockTransferMoney.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Money sent successfully");
    }));
    test("should return Invalid pin, please try again", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: true, data: [], statusCode: 406, message: "Transfer error, you don't have enough fund" };
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, email: "demo@gmail.com" };
        const mockTransferMoney = jest_helper_1.mockFunction(accountService.sendMoney);
        const response = mockTransferMoney.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Transfer error, you don't have enough fund");
        expect(res.error).toBeTruthy();
        expect(res.statusCode).toBe(406);
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, email: "demo@gmail.com" };
        const mockTransferMoney = jest_helper_1.mockFunction(accountService.sendMoney);
        mockTransferMoney(payload);
        expect(mockTransferMoney).toBeCalledTimes(1);
        expect(mockTransferMoney.name).toBe('sendMoney');
        expect(mockTransferMoney).toBeCalledWith(payload);
    }));
});
describe("Testing transferMoney function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Transfer successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Transfer successful" };
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, accountNumber: 98782829 };
        const mockDepositMoney = jest_helper_1.mockFunction(accountService.transferMoney);
        const response = mockDepositMoney.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Transfer successful");
    }));
    test("should return Invalid pin, please try again", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: true, data: [], statusCode: 406, message: "Transfer error, you don't have enough fund" };
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, accountNumber: 98782829 };
        const mockDepositMoney = jest_helper_1.mockFunction(accountService.transferMoney);
        const response = mockDepositMoney.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Transfer error, you don't have enough fund");
        expect(res.error).toBeTruthy();
        expect(res.statusCode).toBe(406);
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, accountNumber: 98782829 };
        const mockDepositMoney = jest_helper_1.mockFunction(accountService.transferMoney);
        mockDepositMoney(payload);
        expect(mockDepositMoney).toBeCalledTimes(1);
        expect(mockDepositMoney.name).toBe('transferMoney');
        expect(mockDepositMoney).toBeCalledWith(payload);
    }));
});
describe("Testing withdrawMoney function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Withdrawal successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Withdrawal successful" };
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, accountNumber: 98782829 };
        const mockWithdrawMoney = jest_helper_1.mockFunction(accountService.withdrawMoney);
        const response = mockWithdrawMoney.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Withdrawal successful");
    }));
    test("should return Withdrawal error, you don't have enough fund", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: true, data: [], statusCode: 406, message: "Withdrawal error, you don't have enough fund" };
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, accountNumber: 98782829 };
        const mockWithdrawMoney = jest_helper_1.mockFunction(accountService.withdrawMoney);
        const response = mockWithdrawMoney.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Withdrawal error, you don't have enough fund");
        expect(res.error).toBeTruthy();
        expect(res.statusCode).toBe(406);
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { userId: 'shsh', pin: 3738, amount: 5000, accountNumber: 98782829 };
        const mockWithdrawMoney = jest_helper_1.mockFunction(accountService.withdrawMoney);
        mockWithdrawMoney(payload);
        expect(mockWithdrawMoney).toBeCalledTimes(1);
        expect(mockWithdrawMoney.name).toBe('withdrawMoney');
        expect(mockWithdrawMoney).toBeCalledWith(payload);
    }));
});
