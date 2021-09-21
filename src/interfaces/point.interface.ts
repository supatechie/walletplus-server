import mongoose, {ObjectId} from 'mongoose'
import { IUserDocument } from './user.interface';

export interface IPointDocument extends mongoose.Document {
    userId: IUserDocument["_id"];
    balance: number
}
