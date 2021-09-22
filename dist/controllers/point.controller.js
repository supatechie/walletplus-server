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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPointHandler = void 0;
const point_service_1 = require("../services/point.service");
const common_1 = require("../interfaces/common");
const interceptors_1 = require("../interceptors");
/**
 * Get a particular user points account
 * @param req Request
 * @param res Response
 */
const getUserPointHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield point_service_1.getUserPoint(req.params.id);
        if (!result.error) {
            yield interceptors_1.storeDataInCacheMemory(req, result);
        }
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(common_1.IFailedResponse.statusCode).json(common_1.IFailedResponse);
    }
});
exports.getUserPointHandler = getUserPointHandler;
