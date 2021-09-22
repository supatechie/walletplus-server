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
const pointService = __importStar(require("../../src/services/point.service"));
// @ts-ignore
const jest_helper_1 = require("../jest.helper");
jest.mock('../../src/services/point.service');
describe("Testing createPoint function", () => {
    test("should return Point wallet created successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Point wallet created successfully" };
        const payload = { balance: 5000, userId: "jdhdhdg" };
        const mockCreatePoint = jest_helper_1.mockFunction(pointService.createPoint);
        const response = mockCreatePoint.mockResolvedValue(result);
        const res = yield response(payload);
        expect(res.error).toBeFalsy();
    }));
    test("should return number of times called", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCreatePoint = jest_helper_1.mockFunction(pointService.createPoint);
        const payload = { balance: 5000, userId: "jdhdhdg" };
        mockCreatePoint(payload);
        expect(mockCreatePoint).toBeCalledTimes(2);
        expect(mockCreatePoint.name).toBe('createPoint');
    }));
});
describe("Testing getUserPoint function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Success", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Success" };
        const mockGetUserPoint = jest_helper_1.mockFunction(pointService.getUserPoint);
        const response = mockGetUserPoint.mockResolvedValueOnce(result);
        const res = yield response('shdkakdj');
        expect(res.message).toBe("Success");
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGetUserPoint = jest_helper_1.mockFunction(pointService.getUserPoint);
        mockGetUserPoint('dhdgs');
        expect(mockGetUserPoint).toBeCalledTimes(1);
        expect(mockGetUserPoint.name).toBe('getUserPoint');
        expect(mockGetUserPoint).toBeCalledWith('dhdgs');
    }));
});
describe("Testing updateUserPoints function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should return Your pin is updated successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: false, data: [], statusCode: 201, message: "Your pin is updated successfully" };
        const payload = { points: 1000, userId: 'dhdhjss' };
        const mockUpdatePoints = jest_helper_1.mockFunction(pointService.updateUserPoints);
        const response = mockUpdatePoints.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("Your pin is updated successfully");
    }));
    test("should return No point found", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = { error: true, data: [], statusCode: 404, message: "No account found" };
        const payload = { points: 1000, userId: 'dhdhjss' };
        const mockUpdatePoints = jest_helper_1.mockFunction(pointService.updateUserPoints);
        const response = mockUpdatePoints.mockResolvedValueOnce(result);
        const res = yield response(payload);
        expect(res.message).toBe("No account found");
        expect(res.error).toBeTruthy();
        expect(res.statusCode).toBe(404);
    }));
    test("should return number of times called and the name", () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { points: 1000, userId: 'dhdhjss' };
        const mockUpdatePoints = jest_helper_1.mockFunction(pointService.updateUserPoints);
        mockUpdatePoints(payload);
        expect(mockUpdatePoints).toBeCalledTimes(1);
        expect(mockUpdatePoints.name).toBe('updateUserPoints');
        expect(mockUpdatePoints).toBeCalledWith(payload);
    }));
});
