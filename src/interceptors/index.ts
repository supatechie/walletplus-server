import { Request, Response, NextFunction} from "express";
import cache from "../cache";

export const storeDataInCacheMemory = async(req: Request, data: any) =>{
    try{
        const key = req.url + req.query
        await cache.set(key,data)
    }catch(error:any) {
    }
}

const cacheInterceptor = async(req: Request, res: Response, next: NextFunction) =>{
    try{
        const key = req.url + req.query
        const data = await cache.get(key)
        if(data){
            return res.status(200).json(data)
        }
        return next()
    }catch(error) {

    }
}
export default cacheInterceptor
