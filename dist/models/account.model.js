"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true },
    pin: { type: Number, required: true }
}, { timestamps: true });
const AccountModel = mongoose_1.default.model("account", AccountSchema);
exports.default = AccountModel;
