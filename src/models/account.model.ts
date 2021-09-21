import mongoose,{Types,ObjectId} from 'mongoose'
import {IAccountDocument} from '../interfaces/account.interface'

const AccountSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        balance: {type: Number, required: true},
        pin: {type: Number, required: true}
    },
    {timestamps: true}
)

const AccountModel = mongoose.model<IAccountDocument>("account",AccountSchema)

export default AccountModel