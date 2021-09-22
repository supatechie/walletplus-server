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
exports.rateLimiter = exports.checkPermission = exports.authVerifyUser = void 0;
const common_1 = require("../interfaces/common");
const user_service_1 = require("../services/user.service");
const helper_util_1 = require("../utils/helper.util");
const jwt_util_1 = require("../utils/jwt.util");
const config_1 = __importDefault(require("../config"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authVerifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authToken = req.cookies._w_p_at;
        const refreshToken = req.cookies._w_p_art;
        //decode the token
        const { payload, isValid, expired } = jwt_util_1.verifyToken(authToken, config_1.default.publicKey);
        // check if it's valid
        if (isValid && payload) {
            // @ts-ignore
            req.user = payload;
            return next();
        }
        // check if it has expired
        if (expired && refreshToken) {
            const verifyRefreshToken = jwt_util_1.verifyToken(refreshToken, config_1.default.privateKey);
            if (verifyRefreshToken.isValid) {
                const result = yield user_service_1.generateNewAuthToken(refreshToken);
                if (!result) {
                    helper_util_1.clearAllCookies(res);
                    return res.status(401).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, message: "Authentication required" }));
                }
                // generate authcookies
                helper_util_1.generateAuthCookies(res, result.authToken, result.refreshToken);
                // @ts-ignore
                req.user = result.user;
                return next();
            }
        }
        helper_util_1.clearAllCookies(res);
        return res.status(401).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, message: "Authentication required" }));
    }
    catch (error) {
        return res.status(500).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 500, message: "Sorry an error requiroccurreded" }));
    }
});
exports.authVerifyUser = authVerifyUser;
const checkPermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        if (req.user.role !== "admin") {
            return res.status(403).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 403, message: "Sorry, you don't have permission to view this resource" }));
        }
        return next();
    }
    catch (error) {
        return res.status(500).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 500, message: "Sorry an error requiroccurreded" }));
    }
});
exports.checkPermission = checkPermission;
exports.rateLimiter = express_rate_limit_1.default({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: JSON.parse(JSON.stringify({
        "message": "Too many requests from this IP address, please try again after 30 minutes",
        "error": true,
        "data": []
    }))
});
