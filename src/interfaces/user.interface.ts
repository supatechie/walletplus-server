import mongoose, {FilterQuery} from 'mongoose'

export interface  IAuthType{
    user: Record<string,any>;
    authToken: string;
    refreshToken: string
}

export interface IUserDocument extends mongoose.Document {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    password: string;
    createdAt: Date;
    updateAt: Date;
    checkEmailExist(): Promise<boolean>;
    checkUsernameExist(): Promise<boolean>;
    checkPhoneExist(): Promise<boolean>;

}
export interface ISessionDocument extends mongoose.Document {
    user: IUserDocument["_id"]
    isValid: Boolean;
    meta_data: object;
    createdAt: Date;
    updateAt: Date;
}