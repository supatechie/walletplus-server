import dotenv from 'dotenv'
dotenv.config()
import express, {Application,urlencoded,Request,Response} from 'express'
import helmet from "helmet"
import compression from 'compression';
import http, {Server} from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongodbConnect from './db/connect'
import log from './logger'
import userRoute from './routes/user.route'
import accountRoute from './routes/account.route'
import transactionRoute from './routes/transaction.route'
import pointRoute from './routes/point.route'
import config from './config';
import { allowedDomains } from './config/corsConfig';

const app: Application = express()
const server: Server = http.createServer(app)
const PORT = parseInt(process.env.PORT as any) || 5000
//for cross origin resource sharing
app.use(cors({origin: allowedDomains(),credentials: true, }))
// parse cookies
app.use(cookieParser())
// compresses all the responses
app.use(compression());
// security
app.use(helmet());
// parse body
app.use(express.json())
app.use(urlencoded({extended: false}))
// mongo db connection 
mongodbConnect()
// all routes
app.use(`${config.site.apiPath}`,userRoute)
app.use(`${config.site.apiPath}`,accountRoute)
app.use(`${config.site.apiPath}`,transactionRoute)
app.use(`${config.site.apiPath}`,pointRoute)

server.listen(PORT, () => {
    log.info(`Server running on url http://localhost:${PORT}`)
})

