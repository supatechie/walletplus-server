import mongoose, {Types} from 'mongoose'

export interface ITransactionDocument extends mongoose.Document {
    fromUser: Types.ObjectId;
    toUser: Types.ObjectId;
    type: 'account' | 'point',
    eventType: 'deposit' | 'withdraw' | 'transfer' | 'send',
    amount: number
}
