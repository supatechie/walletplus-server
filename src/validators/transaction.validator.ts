import {param,ValidationChain} from "express-validator"

export const validateTransactionId:ValidationChain[] = [
    param('id').trim().not().isEmpty().withMessage('Transaction id is required'),
]

