"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = void 0;
const express_validator_1 = require("express-validator");
exports.validateUserId = [
    express_validator_1.param('id').trim().not().isEmpty().withMessage('User id is required'),
];
