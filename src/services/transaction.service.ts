import {DocumentDefinition,FilterQuery, QueryOptions, SchemaTypes} from 'mongoose'
import { ISuccessResponse,IFailedResponse,IResultType } from '../interfaces/common'
import { ITransactionDocument } from '../interfaces/transaction.interface'
import TransactionModel from '../models/transaction.model'

/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
export const createTransaction = async(body:DocumentDefinition<ITransactionDocument>):Promise<IResultType> =>{
    try{
        const res = await TransactionModel.create(body)
        return {...ISuccessResponse,statusCode: 201,message: "Transaction inserted successfully"}
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
export const getATransaction = async(id: string):Promise<IResultType> =>{
    try{
        let _id = new SchemaTypes.ObjectId(id)
        let res = await TransactionModel.findOne({_id}).lean().exec()
        if(!res){
            return {...IFailedResponse,message: "No transaction found",statusCode: 404}
        }
        return {...ISuccessResponse,data:[{...res,_id: res._id.toString()}]}
    }
    catch(error){
        return IFailedResponse
    }
}

/**
 *  Get transactions
 * @returns IResultType
 */
 export const getTransactions = async(query: FilterQuery<ITransactionDocument>,options?: QueryOptions):Promise<IResultType> =>{
    try{
        const total = await TransactionModel.countDocuments(query).exec()
        const data = await TransactionModel.find(query,{}, options).populate('fromUser','email _id firstName').populate('toUser','email _id firstName').lean().exec()
        if(data.length < 1){
            return {...IFailedResponse,message: "No transaction found",statusCode: 404}
        }
        return {...ISuccessResponse,data: [{total, transactions:data}]}
    }
    catch(error){
        return IFailedResponse
    }
}




