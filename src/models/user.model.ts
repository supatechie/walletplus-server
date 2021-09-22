import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import {IUserDocument} from '../interfaces/user.interface'
const UserSchema = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        role: {type: String, required: true},
        password: {type: String, required: true},
        phone: {type: String, required: true},

    },
    {timestamps: true}
)

UserSchema.pre("save", async function (next: any){
    let user = this as IUserDocument;
    if(!user.isModified("password")) return next()
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hashSync(user.password,salt)
    user.password = hash
    return next()
})

UserSchema.methods.checkEmailExist = async function(){
    let user = this as IUserDocument;
    return await UserModel.findOne({email: user.email}).then(u => {
        if(!u) return false
        return true
    }).catch(e => true)
}
UserSchema.methods.checkUsernameExist = async function(){
    let user = this as IUserDocument;
    return await UserModel.findOne({username: user.username}).then(u => {
        if(!u) return false
        return true
    }).catch(e => true)
}
UserSchema.methods.checkPhoneExist = async function(){
    let user = this as IUserDocument;
    return await UserModel.findOne({phone: user.phone}).then(u => {
        if(!u) return false
        return true
    }).catch(e => true)
}


const UserModel = mongoose.model<IUserDocument>("User",UserSchema)

export default UserModel