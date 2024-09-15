import mongoose from 'mongoose';

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      match: /^[a-zA-Z\s'-]+$/
    },
    lastName: {
      type: String,
      required: true,
      match: /^[a-zA-Z\s'-]+$/
    },
    phoneNumber: {
      type: String,
      match: /^(\+234\d{10}|234\d{10}|0[789][01]\d{8})$/,
      required: function() {
        // Only require phone number for non-OAuth users
        return !this.googleId;
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 64,
      required: function() {
        // Only require password for non-OAuth users
        return !this.googleId;
      }
    },
    image: {
      type: String,
      default: ""
    },
    imagePublicId: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verificationToken: String,
    verificationTokenExpires: Date,
    googleId: {
      type: String, 
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
