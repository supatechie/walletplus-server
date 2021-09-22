"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransactionId = void 0;
const express_validator_1 = require("express-validator");
exports.validateTransactionId = [
    express_validator_1.param('id').trim().not().isEmpty().withMessage('Transaction id is required'),
];
