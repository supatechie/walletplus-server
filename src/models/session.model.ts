import mongoose from 'mongoose'
import {ISessionDocument} from '../interfaces/user.interface'
const SessionSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        meta_data: Object,
        session: String,
        isValid: {type: Boolean, default: true},
        userAgent: {type: String}
    },
    {timestamps: true}
)


const SessionModel = mongoose.model<ISessionDocument>("Session",SessionSchema)

export default SessionModel