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
exports.getUser = exports.getAllUsers = exports.generateNewAuthToken = exports.validatePassword = exports.findUser = exports.signOutUser = exports.signInUser = exports.createUser = void 0;
const lodash_1 = require("lodash");
const common_1 = require("../interfaces/common");
const user_model_1 = __importDefault(require("../models/user.model"));
const point_model_1 = __importDefault(require("../models/point.model"));
const account_model_1 = __importDefault(require("../models/account.model"));
const session_model_1 = __importDefault(require("../models/session.model"));
const jwt_util_1 = require("../utils/jwt.util");
const helper_util_1 = require("../utils/helper.util");
const config_1 = __importDefault(require("../config"));
const event_manager_1 = __importDefault(require("../events/event.manager"));
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
const createUser = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _body = Object.assign(Object.assign({}, body), { role: 'user' });
        const userModel = new user_model_1.default(_body);
        const emailExist = yield userModel.checkEmailExist();
        const usernameExist = yield userModel.checkUsernameExist();
        const phoneExist = yield userModel.checkPhoneExist();
        const attr = emailExist ? 'email address' : phoneExist ? 'phone number' : 'username';
        if (emailExist || usernameExist || phoneExist) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: `User with that ${attr} already exist` });
        }
        const user = yield user_model_1.default.create(_body);
        // emit wallet and point event if registration successful
        event_manager_1.default.emit('create_user_account', { userId: user._id, balance: 0 });
        // emit event to send mail if registration successful
        event_manager_1.default.emit('send_registration_mail', user);
        // return
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [], statusCode: 201, message: `Registration successful. A mail has been sent to ${_body.email}, please login to verify your account` });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.createUser = createUser;
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
const signInUser = ({ username, password }, meta_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validate user's password by username or email
        let _user = yield exports.validatePassword({ username, password });
        if (!_user) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, message: `Wrong username/password provided` });
        }
        // delete password from the object
        const _userObj = lodash_1.omit(JSON.parse(JSON.stringify(_user)), 'password');
        // save the session in the database
        const session = new session_model_1.default({ user: _userObj._id, meta_data });
        const result = yield session.save();
        // compose user session obj
        const user = Object.assign(Object.assign({}, _userObj), { _s_id: result._id });
        // sign the auth tokens
        const authToken = jwt_util_1.signToken(user, config_1.default.publicKey, { expiresIn: 18000 });
        const refreshToken = jwt_util_1.signToken(user, config_1.default.privateKey, { expiresIn: 180000 });
        if (!authToken || !refreshToken) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { statusCode: 401, message: "Sorry an error occurred trying to process your request, try again" });
        }
        // send feedback
        const payload = { user, authToken, refreshToken };
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [{ user, payload }], message: "Login successful" });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.signInUser = signInUser;
const signOutUser = (_refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // decode the refresh token
        const { payload } = jwt_util_1.decodeToken(_refreshToken);
        const _s_id = lodash_1.get(payload, "_s_id");
        const _user_id = lodash_1.get(payload, "_id");
        // find the session
        yield session_model_1.default.findOneAndUpdate({ _id: _s_id, user: _user_id }, { isValid: false }).exec();
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { statusCode: 200, message: "Logout successful" });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.signOutUser = signOutUser;
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
/**
 *  find by username or email or phone
 */
const validatePassword = ({ username, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = helper_util_1.caseInsensitive(username);
        let user = yield user_model_1.default.findOne().or([{ username: query }, { email: query }, { phone: query }]).exec();
        if (!user)
            return null;
        const isValid = yield helper_util_1.comparePassword(password, user.password);
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
 * @param _refreshToken - of the signed in user
 * @returns
 */
const generateNewAuthToken = (_refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // decode the refresh token
        const { payload } = jwt_util_1.decodeToken(_refreshToken);
        const _s_id = lodash_1.get(payload, "_s_id");
        const _user_id = lodash_1.get(payload, "_id");
        if (!payload || !_user_id || !_s_id)
            return false;
        // find the session
        const session = yield session_model_1.default.findOne({ _id: _s_id, user: _user_id }).exec();
        if (!session || !session.isValid)
            return false;
        // find the user
        const body = yield exports.findUser({ _id: session.user });
        if (!body)
            return false;
        // create new auth tokens
        const _user = lodash_1.omit(JSON.parse(JSON.stringify(body)), 'password');
        const user = Object.assign(Object.assign({}, _user), { _s_id });
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
 * Fetch all users and return data of IResultType
 * @returns IResultType
 */
const getAllUsers = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield user_model_1.default.countDocuments({}).exec();
        const data = yield user_model_1.default.find(query, '-__v -password', options).lean().exec();
        if (data.length < 1) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No user found", statusCode: 404 });
        }
        const users = [];
        for (let index = 0; index < data.length; index++) {
            const user = data[index];
            const account = yield account_model_1.default.findOne({ userId: user._id }, '-__v -_id -pin').lean().exec();
            const point = yield point_model_1.default.findOne({ userId: user._id }, '-__v -_id').lean().exec();
            const _user = Object.assign(Object.assign({}, user), { account, point });
            users.push(_user);
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [{ totalUsers, users }] });
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
        let user = yield user_model_1.default.findOne({ _id: user_id }, '-__v -password').lean().exec();
        if (!user) {
            return Object.assign(Object.assign({}, common_1.IFailedResponse), { message: "No user found", statusCode: 404 });
        }
        return Object.assign(Object.assign({}, common_1.ISuccessResponse), { data: [user] });
    }
    catch (error) {
        return common_1.IFailedResponse;
    }
});
exports.getUser = getUser;
