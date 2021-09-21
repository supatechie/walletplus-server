import { EventEmitter } from 'events'
EventEmitter.defaultMaxListeners = 1000000000
EventEmitter.captureRejections = true
const EventsManager = new EventEmitter()
import * as accountService from '../services/account.service'
import * as pointService from '../services/point.service'
import * as transactionService from '../services/transaction.service'

EventsManager.on('create_user_account', async(payload) =>{
    await accountService.createAccount(payload)
    await pointService.createPoint(payload)
})
EventsManager.on('update_user_points', async(payload) =>{
    await pointService.updateUserPoints(payload)
})
EventsManager.on('save_transaction', async(payload) =>{
    await transactionService.createTransaction(payload)
})
EventsManager.on('send_registration_mail', async(payload) =>{
    // console.log(payload)
})
export default EventsManager