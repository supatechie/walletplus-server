"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePinInput = exports.validateAccountInput = exports.validateSendInput = exports.validateDepositInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateDepositInput = [
    express_validator_1.body('userId').trim().not().isEmpty().withMessage('User id is required'),
    express_validator_1.body('amount').trim().not().isEmpty().withMessage('Amount is required'),
    express_validator_1.body('pin').trim().not().isEmpty().withMessage('Pin is required')
];
exports.validateSendInput = [
    express_validator_1.body('userId').trim().not().isEmpty().withMessage('User id is required'),
    express_validator_1.body('amount').trim().not().isEmpty().withMessage('Amount is required'),
    express_validator_1.body('email').trim().not().isEmpty().withMessage('Email is required').bail().isEmail().withMessage('Please enter a valid email'),
    express_validator_1.body('pin').trim().not().isEmpty().withMessage('Pin is required')
];
exports.validateAccountInput = [
    express_validator_1.body('userId').trim().not().isEmpty().withMessage('User id is required'),
    express_validator_1.body('amount').trim().not().isEmpty().withMessage('Amount is required'),
    express_validator_1.body('accountNumber').trim().not().isEmpty().withMessage('Account number is required'),
    express_validator_1.body('pin').trim().not().isEmpty().withMessage('Pin is required')
];
exports.validatePinInput = [
    express_validator_1.body('userId').trim().not().isEmpty().withMessage('User id is required'),
    express_validator_1.body('pin').trim().not().isEmpty().withMessage('Pin is required'),
    express_validator_1.body('pin').trim().not().isEmpty().withMessage('Pin is required')
];
