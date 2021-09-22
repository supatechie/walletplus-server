import mongoose from 'mongoose'
import config from '../config'
import log from '../logger'

const mongodbConnect =  async () =>{
    try {
        const uri = config.mongo.mongodb_ur as string
        await mongoose.connect(uri)
        log.info(`database connected on uri ${config.mongo.mongodb_ur}`)
    } catch (error: any) {
       console.log(error.message) 
    //    process.exit(0)
    }
}
export default mongodbConnect