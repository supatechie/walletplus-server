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
exports.authVerifyUser = void 0;
const common_1 = require("../interfaces/common");
const user_service_1 = require("../services/user.service");
const helper_util_1 = require("../utils/helper.util");
const jwt_util_1 = require("../utils/jwt.util");
const authVerifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.cookies._my_at;
    const refreshToken = req.cookies._my_art;
    if (!authToken || !refreshToken) {
        helper_util_1.clearAllCookies(res);
        return Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, errors: [{ msg: "Authentication required" }] });
    }
    //decode the token
    const { payload, isValid, expired } = jwt_util_1.decodeToken(authToken);
    // check if it has expired
    if (expired && !payload) {
        const result = yield user_service_1.generateNewAuthToken(refreshToken);
        if (!result) {
            helper_util_1.clearAllCookies(res);
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, errors: [{ msg: "Authentication required" }] });
        }
        // generate authcookies
        helper_util_1.generateAuthCookies(res, result.authToken, result.refreshToken);
        // @ts-ignore
        req.user = result.user;
        return next();
    }
    // check if it's valid
    if (isValid && payload) {
        // @ts-ignore
        req.user = payload;
        return next();
    }
    helper_util_1.clearAllCookies(res);
    return Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, errors: [{ msg: "Authentication required" }] });
});
exports.authVerifyUser = authVerifyUser;
