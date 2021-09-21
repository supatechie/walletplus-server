import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import {authVerifyUser,checkPermission} from "../middlewares/common"
import cacheInterceptor from "../interceptors"
import { validateTransactionId } from "../validators/transaction.validator";
import { validateUserId } from "../validators/common.validator";
import {getUserTransactionsHandler, getAllTransactionsHandler, getATransactionHandler } from '../controllers/transaction.controller'

const route = Router()
/**
 * Get a single user transaction
 */
route.get(`/transactions/*user/:id`,authVerifyUser, validate(validateUserId), cacheInterceptor, getUserTransactionsHandler)
/**
 * Get a transaction details
 */
 route.get(`/transactions/:id`, authVerifyUser, validate(validateTransactionId), cacheInterceptor, getATransactionHandler)
/**
 * Get all transactions
 */
route.get(`/transactions`, authVerifyUser, checkPermission, cacheInterceptor, getAllTransactionsHandler)
export default route