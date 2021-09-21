import {Request, Response } from 'express'
import { getUserAccount,depositMoney, sendMoney, transferMoney, withdrawMoney, updateAccountPin } from '../services/account.service'
import { IFailedResponse, ISuccessResponse } from '../interfaces/common'
import { storeDataInCacheMemory } from '../interceptors'

/**
 * Get a particular user account  
 * @param req Request
 * @param res Response
 */
 export const getUserAccountHandler = async (req: Request, res: Response) =>{
    try{
        const result = await getUserAccount(req.params.id)
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
 *  Deposit money    
 * @param req Request
 * @param res Response
 */
 export const depositMoneyHandler = async (req: Request, res: Response) =>{
    try{
    const { amount, pin, userId } = req.body
        const result = await depositMoney({userId, amount: parseFloat(amount), pin: parseFloat(pin)})
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
/**
 *  Send money    
 * @param req Request
 * @param res Response
 */
 export const sendMoneyHandler = async (req: Request, res: Response) =>{
    try{
        const { amount, pin, userId, email } = req.body
        const result = await sendMoney({amount:parseFloat(amount), pin: parseFloat(pin), userId, email})
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
/**
 *  Transfer money    
 * @param req Request
 * @param res Response
 */
 export const transferMoneyHandler = async (req: Request, res: Response) =>{
    try{
        const { amount, pin, userId, accountNumber } = req.body
        const result = await transferMoney({amount:parseFloat(amount), pin: parseFloat(pin), userId, accountNumber})
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
/**
 *  Withdraw money    
 * @param req Request
 * @param res Response
 */
 export const withdrawMoneyHandler = async (req: Request, res: Response) =>{
    try{
        const { amount, pin, userId, accountNumber } = req.body
        const result = await withdrawMoney({amount:parseFloat(amount), pin: parseFloat(pin), userId, accountNumber})
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
/**
 * Update user's pin    
 * @param req Request
 * @param res Response
 */
 export const updatePinHandler = async (req: Request, res: Response) =>{
    try{
        const { userId, pin } = req.body
        const result = await updateAccountPin(userId,parseFloat(pin))
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}