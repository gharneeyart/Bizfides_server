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
            unique: true,  // unique phone number per user
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
        role:{
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);
export default mongoose.model('User', userSchema)
