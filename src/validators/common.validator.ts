import {param,ValidationChain} from "express-validator"

export const validateUserId:ValidationChain[] = [
    param('id').trim().not().isEmpty().withMessage('User id is required'),
]



