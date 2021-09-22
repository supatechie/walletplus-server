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
exports.storeDataInCacheMemory = void 0;
const cache_1 = __importDefault(require("../cache"));
const storeDataInCacheMemory = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = req.url + req.query;
        yield cache_1.default.set(key, data);
    }
    catch (error) {
    }
});
exports.storeDataInCacheMemory = storeDataInCacheMemory;
const cacheInterceptor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = req.url + req.query;
        const data = yield cache_1.default.get(key);
        if (data) {
            return res.status(200).json(data);
        }
        return next();
    }
    catch (error) {
    }
});
exports.default = cacheInterceptor;
