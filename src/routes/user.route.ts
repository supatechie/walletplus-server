import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import {authVerifyUser,checkPermission,rateLimiter} from "../middlewares/common"
import { validateSignInput, validateUserInput } from "../validators/user.validator";
import {createUserHandler, getAllUsersHandler,getUserHandler,loginHandler,refreshAuthTokenHandler,logoutHandler} from '../controllers/user.controller'
import cacheInterceptor from "../interceptors"

const route = Router()
/**
 * Create a new user
 */
route.post(`/register`,validate(validateUserInput), rateLimiter, createUserHandler)
/**
 * Sign in a user
 */
route.post(`/login`, validate(validateSignInput), loginHandler)
/**
 * Get all users
 */
route.get(`/users`,authVerifyUser, checkPermission, cacheInterceptor, getAllUsersHandler) 
/**
 * Get a user
 */
route.get(`/users/:user_id`, authVerifyUser, cacheInterceptor, getUserHandler)
/**
 * Refresh auth token
 */
route.get(`/refresh_token`,refreshAuthTokenHandler)
/**
 * Logout user
 */
 route.get(`/logout`,logoutHandler)

export default route