import mongoose,{DocumentDefinition,FilterQuery, SchemaTypes, Types} from 'mongoose'
import { ISuccessResponse,IFailedResponse,IResultType } from '../interfaces/common'
import { IPointDocument } from '../interfaces/point.interface'
import PointModel from '../models/point.model'

type TUpdatePoints = {
    points: number;
    userId: string;
}
/**
 * Create a new user and return an object of IResultType
 * @param body IUserDocument
 * @returns IResultType
 */
export const createPoint = async(body:DocumentDefinition<IPointDocument>):Promise<IResultType> =>{
    try{
        await PointModel.create(body)
        return {...ISuccessResponse,statusCode: 201,message: "Point wallet created successfully"}
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
export const getUserPoint = async(userId: string):Promise<IResultType> =>{
    try{
        let wallet = await PointModel.findOne({userId}).lean().exec()
        if(!wallet){
            return {...IFailedResponse,message: "No wallet found",statusCode: 404}
        }
        return {...ISuccessResponse,data:[{...wallet,_id: wallet._id.toString()}]}
    }
    catch(error){
        return IFailedResponse
    }
}

export const updateUserPoints = async({points,userId}:TUpdatePoints) => {
    try{
        let account = await PointModel.findOne({userId})
        if(!account){
            return {...IFailedResponse,message:"No account found",statusCode: 404}
        }
        await PointModel.findOneAndUpdate({userId}, {$inc: {balance: points }})
        return ISuccessResponse
    }
    catch(error){
        return IFailedResponse
    }
}


