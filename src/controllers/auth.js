import User from "../models/user.js";
import { comparePassword, hashPassword } from "../helpers/auth.js";
import {
  generateResetToken,
  generateTokenAndSetCookie,
} from "../utils/generateTokenAndSetCookies.js";
import { cloudinary } from "../configs/cloudinary.config.js";
import {
  sendVerifyEmail,
  sendResetEmail,
  WelcomeEmail,
} from "../utils/sendEmail.js";
import { generateRandomToken } from "../helpers/generateToken.js";
import dotenv from "dotenv";


// Load environment variables from .env file
dotenv.config();

// Controller for user registration (sign-up)
export const signUp = async (req, res) => {
  try {
    // Destructure user details from the request body
    const { firstName, lastName, phoneNumber, email, password } = req.body;
    const image = req.file;

    // Validate required fields
    if (!firstName) {
      return res
        .status(400)
        .json({ success: false, message: "FirstName is required" });
    }
    if (!lastName) {
      return res
        .status(400)
        .json({ success: false, message: "LastName is required" });
    }
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Phone Number is required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist!" });
    }

    // Hash the user's password for secure storage
    const hashed = await hashPassword(password);

    // Generate a random verification token
    const tokens = generateRandomToken();

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
    if (image) {
      try {
        const imagePath = await cloudinary.uploader.upload(image.path);
        user.image = imagePath.secure_url;
        user.imagePublicId = imagePath.public_id;
      } catch (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "Error uploading image",
          err,
        });
      }
    }

    // Save the new user to the database
    await user.save();
    console.log(user);

    // Generate the verification URL to be sent via email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${tokens}`;

    // Generate a JWT token, set it in a cookie, and send the verification email
    const token = generateTokenAndSetCookie(res, user._id);
    await sendVerifyEmail(user.email, user.firstName, verificationUrl);

    // Respond with the user data and the verification token
    return res.json({ success: true, user, token });
  } catch (err) {
    // Handle any errors during sign-up
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Resend token function
export const resendVerificationToken = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // generate a new token 
    const newToken = generateRandomToken();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${newToken}`;

    //update the new token 
    user.verificationToken = newToken

    //send email
    await sendVerifyEmail(user.email, user.firstName, verificationUrl);
    await user.save();
    
    return res.json({
      success: true,
      message: "Verification token resent",
      token: newToken,
    });
  } catch (err) {
    console.error("Resend Token Error:", err);
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Mark the user as verified and clear the token fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await WelcomeEmail(user.email, user.firstName);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    // Handle any errors during email verification
    console.error("Error verifying email:", err);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller for user login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found or not verified" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is not verified" });
    }

    // Check if the user has registered with Google

    if (user.googleId && user.googleId != "reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare the provided password with the stored hashed password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate a JWT token, set it in a cookie, and update the user's last login time
    const token = generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    // Respond with the user's data, excluding the password
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        image: user.image,
        role: user.role,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified,
        token,
      },
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
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email" });
    }

    // Generate reset token
    const resetToken = generateResetToken(user._id);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create password reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send password reset email
    await sendResetEmail(email, user.firstName, resetLink);

    return res.json({
      success: true,
      message: "Reset password instructions sent successfully",
    });
  } catch (err) {
    console.error("Forgot password error: ", err);
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
      });
  }
};

// Controller for resetting the password
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { resetToken } = req.params;

    // Validate new password and token
    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New password is required" });
    }

    if (!resetToken) {
      return res
        .status(400)
        .json({ success: false, message: "Reset token is required" });
    }

    // Find user by resetToken and ensure the token has not expired
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token should still be valid
    });

    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    if (user.googleId) {
      user.googleId = "reset";
    }

    // Clear the reset token and expiration
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error: ", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Password reset failed",
        error: err.message,
      });
  }
};
