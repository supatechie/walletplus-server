import mongoose, {ObjectId} from 'mongoose'
import { IUserDocument } from './user.interface';

export interface IAccountDocument extends mongoose.Document {
    userId: IUserDocument["_id"];
    balance: number;
    pin: number
}
