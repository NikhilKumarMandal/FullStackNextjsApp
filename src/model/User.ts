import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
})



export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[]
}


const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true,"username is requried"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true,"email is requried"],
        unique: true,
        match: [/.+\@.+\..+/,"Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true,"password is requried"], 
    },
    verifyCode: {
        type: String,
        required: [true,"verify code is requried"], 
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true,"verify code Expiry is requried"], 
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessage:{
        type: Boolean,
        default: false
    },
    message: [MessageSchema]
})

const UserModel =(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',UserSchema)

export default UserModel