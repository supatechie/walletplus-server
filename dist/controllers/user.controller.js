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
exports.isAuthenticatedHandler = exports.refreshAuthTokenHandler = exports.logoutHandler = exports.loginHandler = exports.getUserHandler = exports.getAllUsersHandler = exports.createUserHandler = void 0;
const user_service_1 = require("../services/user.service");
const common_1 = require("../interfaces/common");
const helper_util_1 = require("../utils/helper.util");
const config_1 = __importDefault(require("../config"));
const jwt_util_1 = require("../utils/jwt.util");
const interceptors_1 = require("../interceptors");
/**
 * Create a new user
 * @param req Request
 * @param res Response
 */
const createUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.createUser(req.body);
        return res.status(result.statusCode).json(result);
    }
    catch (error) {
        return res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.createUserHandler = createUserHandler;
/**
 * Get all users
 * @param req Request
 * @param res Response
 */
const getAllUsersHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.getAllUsers({}, { limit: 50, sort: { createdAt: -1 } });
        if (!result.error) {
            yield interceptors_1.storeDataInCacheMemory(req, result);
        }
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.getAllUsersHandler = getAllUsersHandler;
/**
 * Get a particular user
 * @param req Request
 * @param res Response
 */
const getUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.getUser(req.params.user_id);
        if (!result.error) {
            yield interceptors_1.storeDataInCacheMemory(req, result);
        }
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.getUserHandler = getUserHandler;
/**
 * Signin a particular user
 * @param req Request
 * @param res Response
 */
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const meta_data = { user_agent: req.get('User-agent') || "", ip_address: req.get('ip-address') || "" };
        const result = yield user_service_1.signInUser(req.body, meta_data);
        if (result.error)
            return res.status(result.statusCode).json(result);
        // get access to the autoken & refreshToken to be set in the cookie
        const { statusCode, data, error, message } = result;
        const { user, payload } = data[0];
        const { authToken, refreshToken } = payload;
        // generate authcookies
        helper_util_1.generateAuthCookies(res, authToken, refreshToken);
        // send response
        res.status(statusCode).json({ data: [user], statusCode, error, message });
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.loginHandler = loginHandler;
const logoutHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _refreshToken = req.cookies._my_art;
        if (!_refreshToken) {
            helper_util_1.clearAllCookies(res);
            return res.status(403).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 403, message: "Sorry an error occurred" }));
        }
        // verify refresh token
        const { isValid } = jwt_util_1.verifyToken(_refreshToken, config_1.default.privateKey);
        if (!isValid) {
            helper_util_1.clearAllCookies(res);
            return res.status(403).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 403, message: "Invalid auth token" }));
        }
        // sign out user
        const result = yield user_service_1.signOutUser(_refreshToken);
        helper_util_1.clearAllCookies(res);
        res.status(result.statusCode).json(Object.assign({}, result));
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.logoutHandler = logoutHandler;
const refreshAuthTokenHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _refreshToken = req.cookies._w_p_art;
        if (!_refreshToken) {
            helper_util_1.clearAllCookies(res);
            return res.status(403).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 403, message: "Failed to authenticate user" }));
        }
        // verify refresh token
        const verifyRefreshToken = jwt_util_1.verifyToken(_refreshToken, config_1.default.privateKey);
        if (!verifyRefreshToken.isValid) {
            return res.status(403).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 403, message: "Authentication required" }));
        }
        // generate new auth token
        const result = yield user_service_1.generateNewAuthToken(_refreshToken);
        if (!result) {
            helper_util_1.clearAllCookies(res);
            return res.status(401).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, message: "Authentication required" }));
        }
        const { authToken, refreshToken, user } = result;
        // generate authcookies
        helper_util_1.generateAuthCookies(res, authToken, refreshToken);
        // send back response
        res.status(200).json(Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [user], statusCode: 200, message: "Auth token refreshed" }));
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.refreshAuthTokenHandler = refreshAuthTokenHandler;
const isAuthenticatedHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _refreshToken = req.cookies._my_art;
        const _authToken = req.cookies._my_at;
        if (!_refreshToken && !_authToken) {
            helper_util_1.clearAllCookies(res);
            return res.status(403).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, message: "Failed to authenticate user" }));
        }
        // generate new auth tokens
        const result = yield user_service_1.generateNewAuthToken(_refreshToken);
        if (!result) {
            helper_util_1.clearAllCookies(res);
            return res.status(401).json(Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, message: "Authentication required" }));
        }
        const { authToken, refreshToken } = result;
        // generate authcookies
        helper_util_1.generateAuthCookies(res, authToken, refreshToken);
        // send back response
        res.status(200).json(Object.assign(Object.assign({}, common_1.ISuccessResponse), { statusCode: 200, message: "Auth token refreshed" }));
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.isAuthenticatedHandler = isAuthenticatedHandler;
