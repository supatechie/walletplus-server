import {DocumentDefinition} from 'mongoose'
import { ISuccessResponse,IFailedResponse,IResultType } from '../interfaces/common'
import { IAccountDocument } from '../interfaces/account.interface'
import AccountModel from '../models/account.model'
import UserModel from '../models/user.model'
import EventsManager from '../events/event.manager'
import { getDepositPoint, caseInsensitive} from '../utils/helper.util'

type ISendPayload = {
    userId: string;
    email: string;
    amount: number;
    pin: number
}
type IDepositPayload = {
    userId: string;
    amount: number;
    pin: number
}
type ITransactionPayload = {
    userId: string;
    amount: number;
    accountNumber: number;
    pin: number
}
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
export const createAccount = async(body:DocumentDefinition<IAccountDocument>):Promise<IResultType> =>{
    try{
        await AccountModel.create({...body,pin:1234})
        return {...ISuccessResponse,statusCode: 201,message: "Account created successfully"}
    }
    catch(error){
        return IFailedResponse
    }
}
/**
 * Fetch a particular user wallet details
 * @param user_id of a user
 * @returns IResultType
 */
export const getUserAccount = async(userId: string):Promise<IResultType> =>{
    try{
        let wallet = await AccountModel.findOne({userId}, '-__v -_id -pin').lean().exec()
        if(!wallet){
            return {...IFailedResponse,message: "No wallet found",statusCode: 404}
        }
        return {...ISuccessResponse,data:[wallet]}
    }
    catch(error){
        return IFailedResponse
    }
}

export const updateAccountPin = async(userId: string, pin: number) =>{
    try{
        let wallet = await AccountModel.findOne({userId}).lean().exec()
        if(!wallet){
            return {...IFailedResponse,message: "No wallet found",statusCode: 404}
        }
        await AccountModel.findOneAndUpdate({userId}, {pin },{useFindAndModify: false})
        return {...ISuccessResponse,data:[], message: 'Your pin is updated successfully'}
    }
    catch(error){
        return IFailedResponse
    }
}

/**
 * Deposit money
 * @param user_id of a user
 * @returns IResultType
 */
 export const depositMoney = async({userId, amount,pin}:IDepositPayload):Promise<IResultType> =>{
    try{
        
        let account = await AccountModel.findOne({userId})
        if(!account){
            return {...IFailedResponse, message: "No wallet found",statusCode: 404}
        }
        if(pin === 1234 || account.pin !== pin){
            return {...IFailedResponse, message: pin === 1234 ? "Change your default pin" : "Invalid pin, please try again",statusCode: 401}
        }
        const balance = account.balance
        const total = balance + amount
        if(total > 1000000){
            return {...IFailedResponse,message:"Deposit error, maximum amount is 1 million",statusCode: 406}
        }
        const update = await AccountModel.findOneAndUpdate({userId}, {$inc: {balance: amount }})
        // emit event to update user points as well
        if(update){
            // emit event to update user points wallets
            const points = getDepositPoint(amount)
            EventsManager.emit('update_user_points', {points,userId})
            // emit event to save transaction history event
            EventsManager.emit('save_transaction', {fromUser: userId, toUser: userId,amount,type: 'account', eventType: 'deposit'})
        }
        return {...ISuccessResponse,message: "Wallet funded successfully",data:[{...update,balance: total}]}
    }
    catch(error){
        return IFailedResponse
    }
}

/**
 * Send money to user's wallet account
 * @param user_id of a user
 * @returns IResultType
 */
 export const sendMoney = async({userId, email, pin,  amount}: ISendPayload):Promise<IResultType> =>{
    try{
        // get current user's account details
        const account = await AccountModel.findOne({userId})
        if(!account){
            return {...IFailedResponse, message: "Your account is not found",statusCode: 404}
        }
        if(pin === 1234 || account.pin !== pin){
            return {...IFailedResponse, message: pin === 1234 ? "Change your default pin" : "Invalid pin, please try again",statusCode: 401}
        }
        const balance = account.balance
        if((balance < amount)){
            return {...IFailedResponse,message: "Transfer error, you don't have enough fund" ,statusCode: 406}
        }
        const currentBalance = balance - amount
        // get the receiver
        let user = await UserModel.findOne({email: caseInsensitive(email) })
        if(!user){
            return {...IFailedResponse, message: "No user found",statusCode: 404}
        }
        // update the receiver's balance
        const update = await AccountModel.findOneAndUpdate({userId: user._id}, {$inc: {balance: amount }},{useFindAndModify: false})
        if(update){
            // debit the sender's account
            await AccountModel.findOneAndUpdate({userId}, {balance: currentBalance },{useFindAndModify: false})
            // emit transfer event
            EventsManager.emit('save_transaction', {fromUser: userId, toUser: user._id,amount,type: 'account', eventType: 'send'})
        }
        return {...ISuccessResponse,message: 'Money sent successfully',data:[{_id: userId, balance: currentBalance}]}
    }
    catch(error){
        return IFailedResponse
    }
}

/**
 * Transfer money
 * @param user_id of a user
 * @returns IResultType
 */
 export const transferMoney = async({userId, accountNumber, pin,  amount}: ITransactionPayload):Promise<IResultType> =>{
    try{
        
        let account = await AccountModel.findOne({userId})
        if(!account){
            return {...IFailedResponse, message:"No account found",statusCode: 404}
        }
        if(pin === 1234 || account.pin !== pin){
            return {...IFailedResponse, message: pin === 1234 ? "Change your default pin" : "Invalid pin, please try again",statusCode: 401}
        }
        const balance = account.balance
        if((balance < amount)){
            return {...IFailedResponse,message: "Transfer error, you don't have enough fund",statusCode: 406}
        }
        const currentBalance = balance - amount
        // debit current user account
        await AccountModel.findOneAndUpdate({userId}, {balance: currentBalance },{useFindAndModify: false})
        // here you can make the withdrawal to the account or emit an event to handle it
        // emit transfer event
        EventsManager.emit('save_transaction', {fromUser: userId, toUser: userId,amount,type: 'account', eventType: 'transfer'})
        return {...ISuccessResponse,message: "Transfer successful",data:[{_id: userId, balance: currentBalance}]}
    }
    catch(error){
        return IFailedResponse
    }
}

/**
 * Deposit money
 * @param user_id of a user
 * @returns IResultType
 */
 export const withdrawMoney = async({userId, pin,  amount}: ITransactionPayload):Promise<IResultType> =>{
    try{
        
        let account = await AccountModel.findOne({userId})
        if(!account){
            return {...IFailedResponse,message: "No account found",statusCode: 404}
        }
        if(pin === 1234 || account.pin !== pin){
            return {...IFailedResponse, message: pin === 1234 ? "Change your default pin" : "Invalid pin, please try again",statusCode: 401}
        }
        const balance = account.balance
        if((balance < amount)){
            return {...IFailedResponse,message:"Withdrawal error, you don't have enough fund",statusCode: 406}
        }
        const currentBalance = balance - amount
        // debit current user account
        await AccountModel.findOneAndUpdate({userId}, {balance: currentBalance },{useFindAndModify: false})
        // here you can make the withdrawal to the account or emit an event to handle it
        // emit transfer event
        EventsManager.emit('save_transaction', {fromUser: userId, toUser: userId,amount,type: 'account', eventType: 'withdrawal'})
        return {...ISuccessResponse,message: "Withdrawal successful",data:[{_id: userId, balance: currentBalance}]}
    }
    catch(error){
        return IFailedResponse
    }
}

