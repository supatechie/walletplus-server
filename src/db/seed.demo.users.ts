import dotenv from 'dotenv'
dotenv.config()
import mongodbConnect from './connect'
import UserModel from '../models/user.model'
import AccountModel from '../models/account.model'
import PointModel from '../models/point.model'
import TransactionModel from '../models/transaction.model'
import SessionModel from '../models/session.model'

export const getFirstName = () =>{
    const firstNames = ['janet', 'Dennis', 'Peter', 'Chukwu', 'Ann', 'Ayoola']
    return firstNames[Math.round(Math.random() * (firstNames.length - 1))]
}
export const getLastName = () =>{
    const lastNames = ['Common', 'James', 'Carter', 'Maxim', 'Gupta', 'Webby']
    return lastNames[Math.round(Math.random() * (lastNames.length - 1))]
}
(async function seedDB() {
    try {
        mongodbConnect()
        // empty the data
        await UserModel.deleteMany({})
        await AccountModel.deleteMany({})
        await PointModel.deleteMany({})
        await TransactionModel.deleteMany({})
        await SessionModel.deleteMany({})
        // create time series
        for(let i = 0; i < 20; i++){
            const _body = i === 0 ? {
                firstName: 'John',
                lastName: 'Doe',
                email: `admin@gmail.com`,
                username: `admin`,
                phone: `08037389273`,
                password: '12345678',
                role: 'admin'
            }:{
                firstName: getFirstName(),
                lastName: getLastName(),
                email: `demo${i}@gmail.com`,
                username: `demo${i}`,
                phone: `080373892${i}`,
                password: '12345678',
                role: 'user'
            }
            const userModel = new UserModel(_body)
            const emailExist = await userModel.checkEmailExist() as boolean
            const usernameExist = await userModel.checkUsernameExist() as boolean
            if(emailExist || usernameExist){
                continue
            }
            const user = await UserModel.create(_body)
            const body = {userId: user._id, balance: 0}
            // create user account
            await AccountModel.create({...body,pin:1234})
            // create points account
            await PointModel.create(body)
            console.log('-------------------------------------------------------------------------')
            console.log(`USER: ${_body.username} & PASSWORD: ${_body.password} has been created. Use it to login`) 
            console.log('---------------------------------------------------------------------')    
        }
        console.log('-------------------------------------------------------------------------')
        console.log('Database seeding done, We created 20 users)')
        console.log('-------------------------------------------------------------------------')
        console.log(`An admin user--- admin -- with password -- 12345678 -- has been created. Use it to login`) 
        console.log('-------------------------------------------------------------------------')
        console.log('You can as well use any of the above users to login')
        console.log('-------------------------------------------------------------------------')
        console.log('Happy testing :)')
        console.log('-------------------------------------------------------------------------')
        process.exit(1)
    } catch (err: any) {
        console.log(err.stack)
    }
})()