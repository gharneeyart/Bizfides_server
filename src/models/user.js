import mongoose from 'mongoose'

const { Schema } = mongoose; 
const userSchema = new Schema(
     {
        googleId: {
          type: String,
          unique: true,
          sparse: true
        },
        firstName:{
            type: String,
            required: true,
            match: /^[a-zA-Z\s'-]+$/
        },
        lastName:{
            type: String,
            required: true,
            match: /^[a-zA-Z\s'-]+$/
        },
        phoneNumber:{
            type: String,
            unique: true, 
            match: /^(\+234\d{10}|234\d{10}|0[789][01]\d{8})$/,
            default: "+2349012345678"
        },
        email:{
            type: String,
            required: true,
            unique: true, 
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        password:{
            type: String,
            required: function() {
                return !this.googleId;
              },
            minlength: 6,
            maxlength: 64,
        },
        image:{
            type: String,
            default: ""
        },
        imagePublicId:{
            type: String
        },
        role:{
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        isVerified:{
            type: Boolean,
            default: false
        },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        verificationToken: String,
        verificationTokenExpires: Date,
    },
    {
        timestamps: true,
    }
);
export default mongoose.model('User', userSchema)
