"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema = new mongoose_1.default.Schema({
    fromUser: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    toUser: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true },
    eventType: { type: String, required: true },
    amount: { type: Number, required: true }
}, { timestamps: true });
const TransactionModel = mongoose_1.default.model("transaction", TransactionSchema);
exports.default = TransactionModel;
