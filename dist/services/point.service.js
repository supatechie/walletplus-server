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
exports.updateUserPoints = exports.getUserPoint = exports.createPoint = void 0;
const common_1 = require("../interfaces/common");
const point_model_1 = __importDefault(require("../models/point.model"));
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
const createPoint = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield point_model_1.default.create(body);
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { statusCode: 201, message: "Point wallet created successfully" });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.createPoint = createPoint;
/**
 * Fetch a particular user wallet details
 * @param user_id of a user
 * @returns IResultType
 */
const getUserPoint = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let wallet = yield point_model_1.default.findOne({ userId }).lean().exec();
        if (!wallet) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No wallet found", statusCode: 404 });
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [Object.assign(Object.assign({}, wallet), { _id: wallet._id.toString() })] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.getUserPoint = getUserPoint;
const updateUserPoints = ({ points, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let account = yield point_model_1.default.findOne({ userId });
        if (!account) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No account found", statusCode: 404 });
        }
        yield point_model_1.default.findOneAndUpdate({ userId }, { $inc: { balance: points } });
        return common_1.ISuccessResponse;
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.updateUserPoints = updateUserPoints;
