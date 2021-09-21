"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignInput = exports.validateUserInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateUserInput = [
    express_validator_1.body('name').trim().not().isEmpty().withMessage('name is required'),
    express_validator_1.body('username').trim().not().isEmpty().withMessage('Username is required'),
    express_validator_1.body('email').trim().not().isEmpty().withMessage('Email is required').bail().isEmail().withMessage('Please enter a valid email'),
    express_validator_1.body('password').trim().not().isEmpty().withMessage('Password is required').bail().isLength({ min: 8 }).withMessage('Password length is too short'),
];
exports.validateSignInput = [
    express_validator_1.body('username').trim().not().isEmpty().withMessage('Enter your username or phone or email'),
    express_validator_1.body('password').trim().not().isEmpty().withMessage('Password is required').bail().isLength({ min: 8 }).withMessage('Password length is too short'),
];
