import { EventEmitter } from 'events'
EventEmitter.defaultMaxListeners = 1000000000
EventEmitter.captureRejections = true
const EventsManager = new EventEmitter()
import * as accountService from '../services/account.service'
import * as pointService from '../services/point.service'
import * as transactionService from '../services/transaction.service'
import { registerMailTemplate } from '../utils/mail.template'
import { mailAccount } from '../utils/mail';
import { IMailData } from '../interfaces/common'
import jwt from 'jsonwebtoken'
import config from '../config'

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
    try {
        const { site, privateKey } = config
        // send a welcome message to the user email
        const token = jwt.sign(
            {email: payload.email, userId: payload._id},
            privateKey as string,
            {expiresIn: "7d"}
        )
        const option = {
            title: "Registration Successful",
            message: `We're really excited to welcome you to WalletPlus. Click on the link below to verify your account. If you didn't request for this, please ignore. Thanks`,
            user: payload.username,
            btnLink: `${site.siteUrl}/?user=${payload.email}&_s_p_r_v_token=${token}`,
            btnText: `Verify My Account`
        }
        const htmlTemplate = await registerMailTemplate(option)
        const mailPayload:IMailData = {
            title: `WalletPlus ${option.title}`,
            email: payload.email,
            htmlTemplate
        }
        return await mailAccount.sendMailToUser(mailPayload)
    } catch (error: any) {
        return { error: true, message: error.message}
    }
})
export default EventsManager