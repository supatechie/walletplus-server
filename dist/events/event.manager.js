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
const events_1 = require("events");
events_1.EventEmitter.defaultMaxListeners = 1000000000;
events_1.EventEmitter.captureRejections = true;
const EventsManager = new events_1.EventEmitter();
const accountService = __importStar(require("../services/account.service"));
const pointService = __importStar(require("../services/point.service"));
const transactionService = __importStar(require("../services/transaction.service"));
const mail_template_1 = require("../utils/mail.template");
const mail_1 = require("../utils/mail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
EventsManager.on('create_user_account', (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield accountService.createAccount(payload);
    yield pointService.createPoint(payload);
}));
EventsManager.on('update_user_points', (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield pointService.updateUserPoints(payload);
}));
EventsManager.on('save_transaction', (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield transactionService.createTransaction(payload);
}));
EventsManager.on('send_registration_mail', (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { site, privateKey } = config_1.default;
        // send a welcome message to the user email
        const token = jsonwebtoken_1.default.sign({ email: payload.email, userId: payload._id }, privateKey, { expiresIn: "7d" });
        const option = {
            title: "Registration Successful",
            message: `We're really excited to welcome you to WalletPlus. Click on the link below to verify your account. If you didn't request for this, please ignore. Thanks`,
            user: payload.username,
            btnLink: `${site.siteUrl}/?user=${payload.email}&_s_p_r_v_token=${token}`,
            btnText: `Verify My Account`
        };
        const htmlTemplate = yield mail_template_1.registerMailTemplate(option);
        const mailPayload = {
            title: `WalletPlus ${option.title}`,
            email: payload.email,
            htmlTemplate
        };
        return yield mail_1.mailAccount.sendMailToUser(mailPayload);
    }
    catch (error) {
        return { error: true, message: error.message };
    }
}));
exports.default = EventsManager;
