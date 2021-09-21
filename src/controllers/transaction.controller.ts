import {Request, Response } from 'express'
import {getTransactions, getATransaction} from '../services/transaction.service'
import { IFailedResponse, ISuccessResponse } from '../interfaces/common'
import cache from "../cache";
import { storeDataInCacheMemory } from '../interceptors';

/**
 * Get a particular user transactions    
 * @param req Request
 * @param res Response
 */
 export const getUserTransactionsHandler = async (req: Request, res: Response) =>{
    try{
        const result = await getTransactions({$or: [
                {
                    fromUser: req.params.id
                },
                {
                    toUser: req.params.id
                }
            ],
        },
        {limit: 50, sort: { createdAt: -1}}
        )
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
 * Get a single transaction details   
 * @param req Request
 * @param res Response
 */
 export const getATransactionHandler = async (req: Request, res: Response) =>{
    try{
        const result = await getATransaction(req.params.id)
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
 * Get all transactions    
 * @param req Request
 * @param res Response
 */
 export const getAllTransactionsHandler = async (req: Request, res: Response) =>{
    try{
        const result = await getTransactions({},{limit: 50, sort: { createdAt: -1}})
        if(!result.error){
            await storeDataInCacheMemory(req,result)
        }
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}

