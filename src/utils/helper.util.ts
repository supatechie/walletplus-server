import bcrypt from 'bcrypt'
import {Response} from 'express'
import {IUserDocument} from '../interfaces/user.interface'
import config from '../config'


type OptionType = {
    userPassword: string,
    password: IUserDocument["password"]
}

type cookieType = {
    res: Response,
    authToken: string,
    refreshToken: string
}
/**
 * Compares a user's password to see if it matches
 * @param userPassword of the current user
 * @param password database password
 * @returns boolean
 */
export const comparePassword = async(userPassword:OptionType['userPassword'],password:OptionType['password']) =>{
    try{
        return bcrypt.compare(userPassword,password).then(() => true).catch(() => false) 
    }
    catch(error){
        return false
    }
}
/**
 * Generate authentication cookies to be stored in the browser
 * @param res Response
 * @param authToken string
 * @param refreshToken string
 */
export const generateAuthCookies = (res:cookieType["res"],authToken: cookieType["authToken"], refreshToken: cookieType["authToken"]) =>{
    // for production
    if(config.environment === "production"){
        res?.cookie('_w_p_at', authToken, { httpOnly: false, expires: new Date(Date.now() + 180000 ), domain: config.domain, secure: false,sameSite: 'strict' });
        res?.cookie('_w_p_art', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 604800000 ), domain: config.domain, secure:false,sameSite: 'strict' });
        return
    }
    // for development
    res?.cookie('_w_p_at', authToken, { httpOnly: false, expires: new Date(Date.now() + 180000 ), secure: false });
    res?.cookie('_w_p_art', refreshToken, { httpOnly: false, expires: new Date(Date.now() + 604800000 ), secure:false });
    return
}
/**
 * Generate unlock app cookies
 * @param res Response
 * @param token string
 * @returns void
 */
export const generateUnlockAppCookies = (res:cookieType["res"],token:cookieType["authToken"]) =>{
    // for production
    if(config.environment === "production"){
        res?.cookie('_my_unlock', token, { httpOnly: false, expires: new Date(Date.now() + 604800000 ), domain: config.domain, secure: false,sameSite: 'strict' });
        return
    }
    // for development
    res?.cookie('_my_unlock', token, { httpOnly: false, expires: new Date(Date.now() + 604800000 ), secure: false });
    return
}
/**
 * Generate forgot password cookies
 * @param res Response
 * @param token string
 * @returns void
 */
export const generateForgotPwdCookie = (res:cookieType["res"],token: cookieType['authToken']) =>{
    // for production
    if(config.environment === "production"){
        res?.cookie('_my_rt_pwd', token, {expires: new Date(Date.now() + 900000 ), secure: false, domain: config.domain, sameSite: 'strict' });
        return
    }
    // for development
    res?.cookie('_my_rt_pwd', token, {expires: new Date(Date.now() + 900000 ), secure: false });
    return
}
/**
 * Clear all cookies
 * @param res Response
 * @returns void
 */
export const clearAllCookies = (res: cookieType['res']) =>{
    // for production create cookies
    if(config.environment === "production"){
        res?.clearCookie('_w_rt_pwd',{path: '/',domain: config.domain});
        res?.clearCookie('_w_p_at',{path: '/',domain: config.domain});
        res?.clearCookie('_w_p_art',{path: '/',domain: config.domain});
        return
    }
    // for development clear old data if found
    res?.clearCookie('_w_rt_pwd');
    res?.clearCookie('_w_p_at');
    res?.clearCookie('_w_p_art');
    return
}

export const caseInsensitive = (word: string) =>{
    return {'$regex': "^" + word + "$", $options: 'i'}   
}
export const getDepositPoint = (amount: number) =>{
    if(amount >= 25001){
        return Math.round((0.05 * amount))
    }
    else if(amount >= 10001){
        return Math.round((0.025 * amount))
    }
    else if(amount >= 5000){
        return Math.round((0.01 * amount))
    }
    else{
        return 0
    }
}
