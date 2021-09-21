import { Request, Response, NextFunction} from "express";
import { IFailedResponse } from "../interfaces/common";
import { IAuthType } from "../interfaces/user.interface";
import { generateNewAuthToken } from "../services/user.service";
import { clearAllCookies, generateAuthCookies } from "../utils/helper.util";
import { verifyToken } from "../utils/jwt.util";
import log from '../logger'
import config from "../config";
import rateLimit from 'express-rate-limit'

export const authVerifyUser = async(req: Request, res: Response, next: NextFunction) =>{
    try{
        const authToken = req.cookies._w_p_at
        const refreshToken = req.cookies._w_p_art
        //decode the token
        const {payload,isValid,expired} = verifyToken(authToken,config.publicKey!)
        // check if it's valid
        if(isValid && payload){
            // @ts-ignore
            req.user = payload
            return next()
        }
        // check if it has expired
        if(expired && refreshToken){
            const verifyRefreshToken = verifyToken(refreshToken,config.privateKey!)
            if(verifyRefreshToken.isValid){
                const result:(boolean | IAuthType) = await generateNewAuthToken(refreshToken)
                if(!result){
                    clearAllCookies(res)
                    return res.status(401).json({...IFailedResponse, statusCode: 401,message:"Authentication required"})
                }
                // generate authcookies
                generateAuthCookies(res, result.authToken,result.refreshToken)
                // @ts-ignore
                req.user = result.user
                return next()
            }
        }
        
        clearAllCookies(res)
        return res.status(401).json({...IFailedResponse, statusCode: 401,message:"Authentication required"})
    }
    catch(error){
        return res.status(500).json({...IFailedResponse, statusCode: 500,message:"Sorry an error requiroccurreded"})

    }
}

export const checkPermission = async(req: Request, res: Response, next: NextFunction) =>{
    try{
        // @ts-ignore
        if(req.user.role !== "admin"){
            return res.status(403).json({...IFailedResponse, statusCode: 403,message:"Sorry, you don't have permission to view this resource"})
        }
        return next()
    }
    catch(error){
        return res.status(500).json({...IFailedResponse, statusCode: 500,message:"Sorry an error requiroccurreded"})

    }
}
export const rateLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: JSON.parse(JSON.stringify({
        "message": "Too many requests from this IP address, please try again after 30 minutes",
        "error": true,
        "data": []
    }))
})