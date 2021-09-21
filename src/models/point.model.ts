import mongoose,{Types} from 'mongoose'
import {IPointDocument} from '../interfaces/point.interface'

const PointSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true},
        balance: {type: Number, required: true},
    },
    {timestamps: true}
)

const PointModel = mongoose.model<IPointDocument>("point",PointSchema)

export default PointModel