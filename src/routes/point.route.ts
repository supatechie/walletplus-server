import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import {authVerifyUser} from "../middlewares/common"
import { validateUserId } from "../validators/common.validator";
import {getUserPointHandler } from '../controllers/point.controller'
import cacheInterceptor from "../interceptors"

const route = Router()
/**
 * Get a single user point
 */
route.get(`/points/*user/:id`,authVerifyUser,validate(validateUserId), cacheInterceptor, getUserPointHandler)

export default route
