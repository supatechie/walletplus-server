"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_manager_1 = __importDefault(require("cache-manager"));
const es6_promise_1 = __importDefault(require("es6-promise"));
const memoryCache = cache_manager_1.default.caching({ store: 'memory', max: 100, ttl: 10 /*seconds*/, promiseDependency: es6_promise_1.default.Promise });
exports.default = memoryCache;
