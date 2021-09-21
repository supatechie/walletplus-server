import mongoose from 'mongoose'
import config from '../config'
import log from '../logger'

const mongodbConnect =  async () =>{
    try {
        const uri = config.mongodb_ur as string
        await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('database connected')
        // log.info(`database connected on uri ${config.mongodb_ur}`)
    } catch (error: any) {
       console.log(error.message) 
    //    process.exit(0)
    }
}
export default mongodbConnect