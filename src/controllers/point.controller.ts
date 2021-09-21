import {Request, Response } from 'express'
import { getUserPoint } from '../services/point.service'
import { IFailedResponse, ISuccessResponse } from '../interfaces/common'
import { storeDataInCacheMemory } from '../interceptors'

/**
 * Get a particular user points account   
 * @param req Request
 * @param res Response
 */
 export const getUserPointHandler = async (req: Request, res: Response) =>{
    try{
        const result = await getUserPoint(req.params.id)
        if(!result.error){
            await storeDataInCacheMemory(req,result)
        }
        res.status(result.statusCode).json(result)
    }
    catch(error) {
        res.status(IFailedResponse.statusCode).json(IFailedResponse)
    }
}
