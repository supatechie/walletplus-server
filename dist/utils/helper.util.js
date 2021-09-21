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
exports.clearAllCookies = exports.generateForgotPwdCookie = exports.generateUnlockAppCookies = exports.generateAuthCookies = exports.comparePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config/config"));
/**
 * Compares a user's password to see if it matches
 * @param userPassword of the current user
 * @param password database password
 * @returns boolean
 */
const comparePassword = (userPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return bcrypt_1.default.compare(userPassword, password).then(() => true).catch(() => false);
    }
    catch (error) {
        return false;
    }
});
exports.comparePassword = comparePassword;
/**
 * Generate authentication cookies to be stored in the browser
 * @param res Response
 * @param authToken string
 * @param refreshToken string
 */
const generateAuthCookies = (res, authToken, refreshToken) => {
    // for production
    if (config_1.default.environment === "production") {
        res === null || res === void 0 ? void 0 : res.cookie('_my_at', authToken, { httpOnly: false, expires: new Date(Date.now() + 180000), domain: config_1.default.domain, secure: false, sameSite: 'strict' });
        res === null || res === void 0 ? void 0 : res.cookie('_my_art', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 604800000), domain: config_1.default.domain, secure: false, sameSite: 'strict' });
        return;
    }
    // for development
    res === null || res === void 0 ? void 0 : res.cookie('_my_at', authToken, { httpOnly: false, expires: new Date(Date.now() + 180000), secure: false });
    res === null || res === void 0 ? void 0 : res.cookie('_my_art', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 604800000), secure: false });
    return;
};
exports.generateAuthCookies = generateAuthCookies;
/**
 * Generate unlock app cookies
 * @param res Response
 * @param token string
 * @returns void
 */
const generateUnlockAppCookies = (res, token) => {
    // for production
    if (config_1.default.environment === "production") {
        res === null || res === void 0 ? void 0 : res.cookie('_my_unlock', token, { httpOnly: false, expires: new Date(Date.now() + 604800000), domain: config_1.default.domain, secure: false, sameSite: 'strict' });
        return;
    }
    // for development
    res === null || res === void 0 ? void 0 : res.cookie('_my_unlock', token, { httpOnly: false, expires: new Date(Date.now() + 604800000), secure: false });
    return;
};
exports.generateUnlockAppCookies = generateUnlockAppCookies;
/**
 * Generate forgot password cookies
 * @param res Response
 * @param token string
 * @returns void
 */
const generateForgotPwdCookie = (res, token) => {
    // for production
    if (config_1.default.environment === "production") {
        res === null || res === void 0 ? void 0 : res.cookie('_my_rt_pwd', token, { expires: new Date(Date.now() + 900000), secure: false, domain: config_1.default.domain, sameSite: 'strict' });
        return;
    }
    // for development
    res === null || res === void 0 ? void 0 : res.cookie('_my_rt_pwd', token, { expires: new Date(Date.now() + 900000), secure: false });
    return;
};
exports.generateForgotPwdCookie = generateForgotPwdCookie;
/**
 * Clear all cookies
 * @param res Response
 * @returns void
 */
const clearAllCookies = (res) => {
    // for production create cookies
    if (config_1.default.environment === "production") {
        res === null || res === void 0 ? void 0 : res.clearCookie('_my_rt_pwd', { path: '/', domain: config_1.default.domain });
        res === null || res === void 0 ? void 0 : res.clearCookie('_my_at', { path: '/', domain: config_1.default.domain });
        res === null || res === void 0 ? void 0 : res.clearCookie('_my_art', { path: '/', domain: config_1.default.domain });
        return;
    }
    // for development clear old data if found
    res === null || res === void 0 ? void 0 : res.clearCookie('_z_e_v_o_rt_pwd');
    res === null || res === void 0 ? void 0 : res.clearCookie('_z_e_vo_at');
    res === null || res === void 0 ? void 0 : res.clearCookie('_z_e_vo_art');
    return;
};
exports.clearAllCookies = clearAllCookies;
