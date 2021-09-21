import {body,ValidationChain} from "express-validator"

export const validateUserInput:ValidationChain[] = [
    body('firstName').trim().not().isEmpty().withMessage('name is required'),
    body('lastName').trim().not().isEmpty().withMessage('name is required'),
    body('username').trim().not().isEmpty().withMessage('Username is required'),
    body('email').trim().not().isEmpty().withMessage('Email is required').bail().isEmail().withMessage('Please enter a valid email'),
    body('password').trim().not().isEmpty().withMessage('Password is required').bail().isLength({min: 8}).withMessage('Password length is too short'),
]

export const validateSignInput:ValidationChain[] = [
    body('username').trim().not().isEmpty().withMessage('Enter your username or phone or email'),
    body('password').trim().not().isEmpty().withMessage('Password is required').bail().isLength({min: 8}).withMessage('Password length is too short'),
]
