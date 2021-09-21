import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import {authVerifyUser} from "../middlewares/common"
import { validateDepositInput, validateSendInput, validateAccountInput, validatePinInput } from "../validators/account.validator";
import {getUserAccountHandler, depositMoneyHandler, sendMoneyHandler, transferMoneyHandler, withdrawMoneyHandler, updatePinHandler } from '../controllers/account.controller'
import cacheInterceptor from "../interceptors"

const route = Router()
/**
 * Get a single user account
 */
route.get(`/accounts/*user/:id`,authVerifyUser, cacheInterceptor, getUserAccountHandler)

/**
 * Deposit money
 */
route.post(`/deposit`, authVerifyUser, validate(validateDepositInput),depositMoneyHandler)
/**
 * Send money
 */
 route.post(`/send`,authVerifyUser, validate(validateSendInput), sendMoneyHandler) 
/**
 * Transfer money
 */
route.post(`/transfer`,authVerifyUser, validate(validateAccountInput), transferMoneyHandler) 
/**
 * Withdraw money
 */
route.post(`/withdraw`, authVerifyUser, validate(validateAccountInput), withdrawMoneyHandler)
/**
 * Update pin
 */
route.patch(`/change_pin`, authVerifyUser, validate(validatePinInput), updatePinHandler)


export default route