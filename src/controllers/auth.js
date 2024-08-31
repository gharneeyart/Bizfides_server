import User from "../models/user.js";
import { comparePassword, hashPassword } from "../helpers/auth.js";
import { generateResetToken, generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookies.js";
import { cloudinary } from "../configs/cloudinary.config.js";
import { sendVerifyEmail, sendResetEmail } from "../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Controller for user registration (sign-up)
export const signUp = async (req, res) => {
    try {
        // Destructure user details from the request body
        const { firstName, lastName, phoneNumber, email, password } = req.body;
        const image = req.file

        // Validate required fields
        if (!firstName) {
            return res.status(400).json({ success: false, message: "FirstName is required" });
        }
        if (!lastName) {
            return res.status(400).json({ success: false, message: "LastName is required" });
        }
        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: "Phone Number is required" });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is taken" });
        }

        // Hash the user's password for secure storage
        const hashed = await hashPassword(password);

        // Generate a random verification token
        const tokens = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new user instance with the provided details and the verification token
        const user = new User({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashed,
            verificationToken: tokens, 
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // Token valid for 24 hours
        });

        // handle image upload
        if(image){
            try {
             const imagePath = await cloudinary.uploader.upload(image.path);
             user.image = imagePath.secure_url;
             user.imagePublicId = imagePath.public_id;
            } catch (err) {
             console.log(err);
             return res.json({success: false, message: "Error uploading image", err})
            }
         }

        // Save the new user to the database
        await user.save();
        console.log(user);

        // Generate the verification URL to be sent via email
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${tokens}`;
       
        // Generate a JWT token, set it in a cookie, and send the verification email
        const token = generateTokenAndSetCookie(res, user._id);
        await sendVerifyEmail(user.email, user.firstName, verificationUrl);

        // Respond with the user data and the verification token
        return res.json({ success: true, user, token });
    } catch (err) {
        // Handle any errors during sign-up
        console.error("Signup Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Controller for email verification
export const verifyEmail = async (req, res) => {
    const { token } = req.params;
  
    try {
        // Find the user with the matching verification token that is still valid
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });
  
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }
  
        // Mark the user as verified and clear the token fields
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
  
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        // Handle any errors during email verification
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Controller for user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found or not verified" });
        }

        // Compare the provided password with the stored hashed password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        // Generate a JWT token, set it in a cookie, and update the user's last login time
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        // Respond with the user's data, excluding the password
        res.status(200).json({
            success: true, 
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        // Handle any errors during login
        console.log("Error in login", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Controller for user logout
export const logout = async (req, res) => {
    // Clear the JWT token from the cookies
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

// Controller for initiating password recovery (forgot password)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate a password reset token and send it to the user's email address
        const resetToken = generateResetToken(user._id);
        const domain = "http://localhost:8070/api/v1/auth";
        const resetLink = `${domain}/reset-password/${resetToken}`;
        await sendResetEmail(email, user.firstName, resetLink);

        // Respond with a success message and the reset token
        return res.json({ message: "Password reset token generated successfully", resetToken });
    } catch (err) {
        // Handle any errors during password recovery
        console.log(err);
        return res.status(500).json({ message: "Password reset token failed" });
    }
};

// Controller for resetting the password
export const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const resetToken = req.headers.authorization;
  
        // Validate the new password and the reset token
        if (!newPassword) {
            return res.status(400).json({ success: false, message: 'Enter new password' });
        }
        if (!resetToken || !resetToken.startsWith("Bearer")) {
            return res.status(401).json({ success: false, message: 'Invalid token or no reset token provided' });
        }

        // Extract the token from the "Bearer" scheme
        const token = resetToken.split(" ")[1];

        // Verify the token using JWT
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(403).json({ success: false, message: "Invalid/expired token provided" });
        }

        // Find the user by the decoded token's userId
        const userId = decodedToken.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "Invalid user" });
        }

        // Hash the new password and update the user's password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        // Respond with a success message
        res.json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        // Handle any errors during password reset
        console.log(err.message);
        return res.status(500).json({ success: false, message: "Password reset failed", error: err.message });
    }
};
