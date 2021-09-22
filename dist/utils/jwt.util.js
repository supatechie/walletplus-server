"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Receives and payoad and sign return a token
 * @param payload object | string | buffer
 * @param securityKey string
 * @param options jwt.SignOptions | undefined
 * @returns string | null
 */
const signToken = (payload, securityKey, options) => {
    try {
        if (!payload || !securityKey)
            return null;
        let token = jsonwebtoken_1.default.sign(payload, securityKey, options);
        return token;
    }
    catch (error) {
        return null;
    }
};
exports.signToken = signToken;
/**
 * Verify a jwt token given a token and security key
 * @param token any jwt token
 * @param securityKey the key used to sign the obj
 * @returns  string | null | jwtPayload
 */
const verifyToken = (token, securityKey) => {
    try {
        if (!token || !securityKey) {
            return { isValid: false, payload: null, expired: true };
        }
        let user = jsonwebtoken_1.default.verify(token, securityKey);
        return { isValid: true, payload: user, expired: false };
    }
    catch (error) {
        return { isValid: false, payload: null, expired: true };
    }
};
exports.verifyToken = verifyToken;
/**
 * Decode a jwt token
 * @param token any jwt token to be decoded
 * @returns string | null | JwtPayload
 */
const decodeToken = (token) => {
    try {
        let payload = jsonwebtoken_1.default.decode(token);
        return { isValid: true, payload, expired: false };
    }
    catch (error) {
        return { isValid: false, payload: null, expired: error.message === "jwt expired" };
    }
};
exports.decodeToken = decodeToken;
