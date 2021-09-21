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
exports.getUser = exports.getAllUsers = exports.signInUser = exports.generateNewAuthToken = exports.validatePassword = exports.findUser = exports.createUser = void 0;
const lodash_1 = require("lodash");
const common_1 = require("../interfaces/common");
const logger_1 = __importDefault(require("../logger"));
const user_model_1 = __importDefault(require("../models/user.model"));
const session_model_1 = __importDefault(require("../models/session.model"));
const jwt_util_1 = require("../utils/jwt.util");
const helper_util_1 = require("../utils/helper.util");
const config_1 = __importDefault(require("../config/config"));
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
const createUser = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userModel = new user_model_1.default(body);
        const emailExist = yield userModel.checkEmailExist();
        const usernameExist = yield userModel.checkUsernameExist();
        if (emailExist || usernameExist) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { errors: [{ msg: `User with that ${emailExist ? "email" : "username"} already exist` }] });
        }
        yield user_model_1.default.create(body);
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { message: "Registration successful" });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.createUser = createUser;
/**
 * Validate user's password
 * @param body IUserDocument
 * @returns IResultType
 */
const findUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_model_1.default.findOne(query).then(u => {
            if (!u)
                return false;
            return u;
        }).catch(e => false);
    }
    catch (error) {
        return false;
    }
});
exports.findUser = findUser;
const validatePassword = ({ username, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find by username or email
        let _user = yield user_model_1.default.find().or([{ username }, { email: username }]).exec();
        logger_1.default.info(JSON.stringify(_user));
        let isValid = false;
        let user;
        if (_user.length === 0 || _user.length > 2)
            return null;
        for (let i = 0; i < _user.length; i++) {
            const u = _user[i];
            isValid = yield helper_util_1.comparePassword(password, u.password);
            if (isValid) {
                user = u;
            }
        }
        if (isValid)
            return user;
        return null;
    }
    catch (_a) {
        return null;
    }
});
exports.validatePassword = validatePassword;
/**
 *
 * @param param0
 * @param meta_data
 * @returns
 */
const generateNewAuthToken = (_refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // decode the refresh token
        const { payload } = jwt_util_1.decodeToken(_refreshToken);
        const id = lodash_1.get(payload, "_id");
        if (!payload || id)
            return false;
        // find the session
        const session = yield session_model_1.default.findById(id);
        if (!session || !session.isValid)
            return false;
        // find the user
        const body = yield exports.findUser({ _id: session.user });
        if (!body)
            return false;
        // create new auth tokens
        const user = lodash_1.omit(JSON.parse(JSON.stringify(body)), 'password');
        const authToken = jwt_util_1.signToken(user, config_1.default.publicKey, { expiresIn: 18000 });
        const refreshToken = jwt_util_1.signToken(user, config_1.default.privateKey, { expiresIn: 180000 });
        // check if the tokens are signed
        if (!authToken || !refreshToken)
            return false;
        const result = { user, authToken, refreshToken };
        return result;
    }
    catch (error) {
        return false;
    }
});
exports.generateNewAuthToken = generateNewAuthToken;
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
const signInUser = ({ username, password }, meta_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validate user's password by username or email
        let _user = yield exports.validatePassword({ username, password });
        logger_1.default.info(JSON.stringify(_user));
        if (!_user) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, errors: [{ msg: `Wrong username/password provided` }] });
        }
        // delete password from the object
        const user = lodash_1.omit(JSON.parse(JSON.stringify(_user)), 'password');
        // sign the auth tokens
        const authToken = jwt_util_1.signToken(user, config_1.default.privateKey, { expiresIn: 18000 });
        const refreshToken = jwt_util_1.signToken(user, config_1.default.publicKey, { expiresIn: 180000 });
        if (!authToken || !refreshToken) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, errors: [{ msg: `Sorry an error occurred trying to process your request, try again` }] });
        }
        // save the session in the database
        const session = { user: user._id, meta_data };
        session_model_1.default.create(session);
        // send feedback
        const payload = { user, authToken, refreshToken };
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [user], payload, message: "Login successful" });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.signInUser = signInUser;
/**
 * Fetch all users and return data of IResultType
 * @returns IResultType
 */
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_model_1.default.find({});
        if (data.length < 1) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { errors: [{ msg: `No user found` }], statusCode: 404 });
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.getAllUsers = getAllUsers;
/**
 * Fetch a particular user and return a result of IResultType
 * @param user_id of a user
 * @returns IResultType
 */
const getUser = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_model_1.default.findOne({ _id: user_id });
        if (data) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { errors: [{ msg: `No user found` }], statusCode: 404 });
        }
        const user = lodash_1.omit(data.toJSON(), "password");
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [user] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.getUser = getUser;
