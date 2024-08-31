import mongoose from 'mongoose'

const { Schema } = mongoose; 
const userSchema = new Schema(
    {
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
            required: true,
        },
        phoneNumber:{
            type: String,
            required: true,
            unique: true,  
        },
        email:{
            type: String,
            required: true,
            unique: true, 
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
            maxlength: 64,
        },
        image:{
            type: String
        },
        imagePublicId:{
            type: String
        },
        role:{
            type: Number,
            default: 0,
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        isVerified:{
            type: Boolean,
            default: false
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        verificationToken: String,
        verificationTokenExpires: Date,
    },
    {
        timestamps: true,
    }
);
export default mongoose.model('User', userSchema)
