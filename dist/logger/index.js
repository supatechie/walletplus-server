"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const pino_1 = __importDefault(require("pino"));
const log = pino_1.default({
    prettyPrint: true,
    base: {
        pid: false
    },
    timestamp: () => `time: ${dayjs_1.default().format()}`
});
exports.default = log;
