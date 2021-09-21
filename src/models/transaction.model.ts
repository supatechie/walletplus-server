import mongoose,{Types} from 'mongoose'
import {ITransactionDocument} from '../interfaces/transaction.interface'

const TransactionSchema = new mongoose.Schema(
    {
        fromUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        toUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        type: {type: String, required: true},
        eventType: {type: String, required: true},
        amount: {type: Number, required: true}
    },
    {timestamps: true}
)

const TransactionModel = mongoose.model<ITransactionDocument>("transaction",TransactionSchema)

export default TransactionModel