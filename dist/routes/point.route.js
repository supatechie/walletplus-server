"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const common_1 = require("../middlewares/common");
const common_validator_1 = require("../validators/common.validator");
const point_controller_1 = require("../controllers/point.controller");
const interceptors_1 = __importDefault(require("../interceptors"));
const route = express_1.Router();
/**
 * Get a single user point
 */
route.get(`/points/*user/:id`, common_1.authVerifyUser, validator_middleware_1.validate(common_validator_1.validateUserId), interceptors_1.default, point_controller_1.getUserPointHandler);
exports.default = route;
