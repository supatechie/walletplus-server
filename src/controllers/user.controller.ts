import {Request, Response } from 'express'
import {createUser,generateNewAuthToken,getAllUsers,getUser,signInUser,signOutUser} from '../services/user.service'
import { IFailedResponse, ISuccessResponse } from '../interfaces/common'
import { IAuthType } from '../interfaces/user.interface'
import { clearAllCookies, generateAuthCookies } from '../utils/helper.util'
import log from '../logger'
import config from "../config";
import { verifyToken } from "../utils/jwt.util";
import { storeDataInCacheMemory } from '../interceptors'

/**
 * Create a new user
 * @param req Request
 * @param res Response
 */
export const createUserHandler = async (req: Request, res: Response) =>{
    try{
        const result = await createUser(req.body)
        return res.status(result.statusCode).json(result)
    }
    catch(error) {
        return res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
/**
 * Get all users
 * @param req Request
 * @param res Response
 */
export const getAllUsersHandler = async (req: Request, res: Response) =>{
    try{
        const result = await getAllUsers({},{limit: 50, sort: { createdAt: -1}})
        if(!result.error){
            await storeDataInCacheMemory(req,result)
        }
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
/**
 * Get a particular user    
 * @param req Request
 * @param res Response
 */
export const getUserHandler = async (req: Request, res: Response) =>{
    try{
        const result = await getUser(req.params.user_id)
        if(!result.error){
            await storeDataInCacheMemory(req,result)
        }
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
} 
/**
 * Signin a particular user   
 * @param req Request
 * @param res Response
 */
 export const loginHandler = async (req: Request, res: Response) =>{
    try{
        const meta_data = {user_agent: req.get('User-agent') || "", ip_address: req.get('ip-address') || ""}
        const result = await signInUser(req.body,meta_data)
        if(result.error) return  res.status(result.statusCode).json(result)
        // get access to the autoken & refreshToken to be set in the cookie
        const {statusCode,data,error,message} = result
        const { user, payload} = data[0] as any
        const {authToken, refreshToken} =  payload as IAuthType
        // generate authcookies
        generateAuthCookies(res, authToken,refreshToken)
        // send response
        res.status(statusCode).json({data:[user],statusCode,error,message})
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
export const logoutHandler = async(req: Request, res: Response) =>{
    try{
        const _refreshToken = req.cookies._my_art
        if(!_refreshToken){
            clearAllCookies(res)
            return res.status(403).json({...IFailedResponse, statusCode: 403,message:"Sorry an error occurred"})
        }
        // verify refresh token
        const {isValid} = verifyToken(_refreshToken,config.privateKey!)
        if(!isValid) {
            clearAllCookies(res)
            return res.status(403).json({...IFailedResponse,statusCode: 403, message:"Invalid auth token"})
        }
        // sign out user
        const result = await signOutUser(_refreshToken)
        clearAllCookies(res)
        res.status(result.statusCode).json({...result})
    }
    catch(error){
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
export const refreshAuthTokenHandler = async(req: Request, res: Response) =>{
    try{
        const _refreshToken = req.cookies._w_p_art
        if(!_refreshToken){
            clearAllCookies(res)
            return res.status(403).json({...IFailedResponse, statusCode: 403,message:"Failed to authenticate user"})
        }
        // verify refresh token
        const verifyRefreshToken = verifyToken(_refreshToken,config.privateKey!)
        if(!verifyRefreshToken.isValid) {
            return res.status(403).json({...IFailedResponse,statusCode: 403, message:"Authentication required"})
        }
        // generate new auth token
        const result:(boolean | IAuthType) = await generateNewAuthToken(_refreshToken)
        if(!result){
            clearAllCookies(res)
            return res.status(401).json({...IFailedResponse, statusCode: 401,message:"Authentication required"})
        }
        const {authToken,refreshToken,user} = result
        // generate authcookies
        generateAuthCookies(res, authToken,refreshToken)
        // send back response
        res.status(200).json({...ISuccessResponse,data:[user],statusCode:200,message: "Auth token refreshed"})
    }
    catch(error){
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
export const isAuthenticatedHandler = async(req: Request, res: Response) =>{
    try{
        const _refreshToken = req.cookies._my_art
        const _authToken = req.cookies._my_at
        if(!_refreshToken && !_authToken){
            clearAllCookies(res)
            return res.status(403).json({...IFailedResponse, statusCode: 401,message:"Failed to authenticate user"})
        }
        // generate new auth tokens
        const result:(boolean | IAuthType) = await generateNewAuthToken(_refreshToken)
        if(!result){
            clearAllCookies(res)
            return res.status(401).json({...IFailedResponse, statusCode: 401,message:"Authentication required"})
        }
        const {authToken,refreshToken} = result
        // generate authcookies
        generateAuthCookies(res, authToken,refreshToken)
        // send back response
        res.status(200).json({...ISuccessResponse,statusCode:200,message: "Auth token refreshed"})
    }
    catch(error){
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
