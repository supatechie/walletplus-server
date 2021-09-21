import {body,ValidationChain} from "express-validator"

export const validateDepositInput:ValidationChain[] = [
    body('userId').trim().not().isEmpty().withMessage('User id is required'),
    body('amount').trim().not().isEmpty().withMessage('Amount is required'),
    body('pin').trim().not().isEmpty().withMessage('Pin is required')
]

export const validateSendInput:ValidationChain[] = [
    body('userId').trim().not().isEmpty().withMessage('User id is required'),
    body('amount').trim().not().isEmpty().withMessage('Amount is required'),
    body('email').trim().not().isEmpty().withMessage('Email is required').bail().isEmail().withMessage('Please enter a valid email'),
    body('pin').trim().not().isEmpty().withMessage('Pin is required')

]

export const validateAccountInput:ValidationChain[] = [
    body('userId').trim().not().isEmpty().withMessage('User id is required'),
    body('amount').trim().not().isEmpty().withMessage('Amount is required'),
    body('accountNumber').trim().not().isEmpty().withMessage('Account number is required'),
    body('pin').trim().not().isEmpty().withMessage('Pin is required')

]
export const validatePinInput:ValidationChain[] = [
    body('userId').trim().not().isEmpty().withMessage('User id is required'),
    body('pin').trim().not().isEmpty().withMessage('Pin is required'),
    body('pin').trim().not().isEmpty().withMessage('Pin is required')

]

