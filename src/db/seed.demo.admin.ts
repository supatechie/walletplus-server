import dotenv from 'dotenv'
dotenv.config()
import mongodbConnect from './connect'
import UserModel from '../models/user.model'
import AccountModel from '../models/account.model'
import PointModel from '../models/point.model'
import TransactionModel from '../models/transaction.model'
import SessionModel from '../models/session.model'

(async function seedDB() {
    try {
        mongodbConnect()
        // empty the data
        await UserModel.deleteMany({})
        await AccountModel.deleteMany({})
        await PointModel.deleteMany({})
        await TransactionModel.deleteMany({})
        await SessionModel.deleteMany({})

        const _body = {
            firstName: 'John',
            lastName: 'Doe',
            email: `admin@gmail.com`,
            username: `admin`,
            phone: `08037389273`,
            password: '12345678',
            role: 'admin'
        }
        const userModel = new UserModel(_body)
        const emailExist = await userModel.checkEmailExist() as boolean
        const usernameExist = await userModel.checkUsernameExist() as boolean
        const phoneExist = await userModel.checkPhoneExist() as boolean

        if(emailExist || usernameExist || phoneExist){
            return
        }
        const user = await UserModel.create(_body)
        const body = {userId: user._id, balance: 0}
        // create user account
        await AccountModel.create({...body,pin:1234})
        // create points account
        await PointModel.create(body)
        console.error('-------------------------------------------------------------------------')
        console.log('Database seeding done, We created 1 Admin user)')
        console.log('-------------------------------------------------------------------------')
        console.log(`USER: ${_body.username} with PASSWORD: ${_body.password} has been created. Use it to login`) 
        console.error('-------------------------------------------------------------------------')
        console.log('Happy testing :)')
        console.log('-------------------------------------------------------------------------')    

    } catch (err: any) {
        console.log(err.stack)
    }
})()
