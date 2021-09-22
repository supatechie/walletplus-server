import {DocumentDefinition,FilterQuery, QueryOptions} from 'mongoose'
import {get, omit} from 'lodash'
import { ISuccessResponse,IFailedResponse,IResultType } from '../interfaces/common'
import {IUserDocument,ISessionDocument,IAuthType} from '../interfaces/user.interface'
import UserModel from '../models/user.model'
import PointModel from '../models/point.model'
import AccountModel from '../models/account.model'
import SessionModel from '../models/session.model'
import { decodeToken, signToken } from '../utils/jwt.util'
import {comparePassword, caseInsensitive} from '../utils/helper.util'
import config from '../config'
import EventsManager from '../events/event.manager'

type IMetaData = {
    ip_address: any;
    user_agent: string;
}
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
export const createUser = async(body:DocumentDefinition<IUserDocument>):Promise<IResultType> =>{
    try{
        const _body = {...body,role: 'user'}
        const userModel = new UserModel(_body)
        const emailExist = await userModel.checkEmailExist() as boolean
        const usernameExist = await userModel.checkUsernameExist() as boolean
        const phoneExist = await userModel.checkPhoneExist() as boolean
        const attr = emailExist ? 'email address': phoneExist ? 'phone number': 'username'
        if(emailExist || usernameExist || phoneExist){
            return {...IFailedResponse,message:`User with that ${attr} already exist`}
        }
        const user = await UserModel.create(_body)
        // emit wallet and point event if registration successful
        EventsManager.emit('create_user_account',{userId: user._id, balance: 0})
        // emit event to send mail if registration successful
        EventsManager.emit('send_registration_mail',user)
        // return
        return {...ISuccessResponse, data: [],statusCode: 201,message: `Registration successful. A mail has been sent to ${_body.email}, please login to verify your account`}
    }
    catch(error){
        return IFailedResponse
    }
}

/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
 export const signInUser = async({username,password}:{username: | IUserDocument['username'] | IUserDocument['email'] | IUserDocument['phone'] ,password: string},meta_data: IMetaData):Promise<IResultType> =>{
    try{
        // validate user's password by username or email
        let _user = await validatePassword({username,password})
        if(!_user){
            return {...IFailedResponse,statusCode: 401,message:`Wrong username/password provided`}
        }
        // delete password from the object
        const _userObj = omit(JSON.parse(JSON.stringify(_user)),'password')
        // save the session in the database
        const session = new SessionModel({user:_userObj._id!,meta_data})
        const result = await session.save()
        // compose user session obj
        const user = {..._userObj,_s_id:result._id}
        // sign the auth tokens
        const authToken = signToken(user,config.publicKey!,{expiresIn: 18000})
        const refreshToken = signToken(user,config.privateKey!,{expiresIn: 180000})
        if(!authToken || !refreshToken){
            return {...IFailedResponse,statusCode: 401,message:"Sorry an error occurred trying to process your request, try again"}
        }
        // send feedback
        const payload:IAuthType = {user,authToken,refreshToken}
        return {...ISuccessResponse,data:[{user,payload}],message: "Login successful"}
    }
    catch(error){
        return IFailedResponse
    }
}

export const signOutUser = async (_refreshToken: string) =>{
    try {
        // decode the refresh token
        const {payload} = decodeToken(_refreshToken)
        const _s_id = get(payload,"_s_id")
        const _user_id = get(payload,"_id")
        // find the session
        await SessionModel.findOneAndUpdate({_id: _s_id,user: _user_id },{isValid: false}).exec()
        return {...ISuccessResponse,statusCode: 200,message: "Logout successful"}
    } catch (error) {
        return IFailedResponse
    }
}

/**
 * Validate user's password
 * @param body IUserDocument
 * @returns IResultType
 */
 export const findUser = async(query: FilterQuery<IUserDocument>) =>{
    try{
        return await UserModel.findOne(query).then(u => {
            if(!u) return false
            return u
        }).catch(e => false)
    }
    catch(error){
        return false
    }
}
/**
 *  find by username or email or phone
 */
export const validatePassword = async({username,password}:{username: string,password: string}) =>{
    try{
        const query = caseInsensitive(username)
        let user = await UserModel.findOne().or([{username: query},{email: query},{phone: query}]).exec()
        if(!user) return null
        const isValid = await comparePassword(password,user.password)
        if(isValid) return user
        return null
    }
    catch{
        return null
    }
}
/**
 * 
 * @param _refreshToken - of the signed in user 
 * @returns 
 */
export const generateNewAuthToken = async (_refreshToken: string) =>{
    try {
        // decode the refresh token
        const {payload} = decodeToken(_refreshToken)
        const _s_id = get(payload,"_s_id")
        const _user_id = get(payload,"_id")
        if(!payload || !_user_id || !_s_id) return false
        // find the session
        const session:(ISessionDocument | null) = await SessionModel.findOne({_id: _s_id,user: _user_id }).exec()
        if(!session || !session.isValid) return false
        // find the user
        const body:(IUserDocument | boolean) = await findUser({_id: session.user}) 
        if(!body) return false
        // create new auth tokens
        const _user = omit(JSON.parse(JSON.stringify(body)),'password')
        const user = {..._user,_s_id}
        const authToken = signToken(user,config.publicKey!,{expiresIn: 18000})
        const refreshToken = signToken(user,config.privateKey!,{expiresIn: 180000})
        // check if the tokens are signed
        if(!authToken || !refreshToken) return false
        const result:IAuthType = {user,authToken,refreshToken}
        return result
    } catch (error) {
        return false
    }
}

/**
 * Fetch all users and return data of IResultType
 * @returns IResultType
 */
export const getAllUsers = async(query: FilterQuery<IUserDocument>,options?: QueryOptions):Promise<IResultType> =>{
    try{
        const totalUsers = await UserModel.countDocuments({}).exec()
        const data = await UserModel.find(query,'-__v -password',options).lean().exec()
        if(data.length < 1){
            return {...IFailedResponse, message:"No user found",statusCode: 404}
        }
        const users = []
        for (let index = 0; index < data.length; index++) {
            const user = data[index];
            const account = await AccountModel.findOne({userId: user._id},'-__v -_id -pin').lean().exec()
            const point = await PointModel.findOne({userId: user._id},'-__v -_id').lean().exec()
            const _user = {...user,account,point}
            users.push(_user)
        }
        return {...ISuccessResponse,data:[{totalUsers,users}]}
    }
    catch(error){
        return IFailedResponse
    }
}

/**
 * Fetch a particular user and return a result of IResultType
 * @param user_id of a user
 * @returns IResultType
 */
export const getUser = async(user_id: string):Promise<IResultType> =>{
    try{
        let user = await UserModel.findOne({_id: user_id}, '-__v -password').lean().exec()
        if(!user){
            return {...IFailedResponse,message:"No user found",statusCode: 404}
        }
        return {...ISuccessResponse,data:[user]}
    }
    catch(error){
        return IFailedResponse
    }
}

