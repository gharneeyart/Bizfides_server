import User from "../models/user.js";
import { cloudinary } from "../configs/cloudinary.config.js";
import { hashPassword } from "../helpers/auth.js";

// CRUD operations

// function to get all users
export const getAllUsers = async (req, res) => {
    try {
        const user = await User.find().select("-password");
        res.json({success: true, message: "Users fetched successfully", user})
    } catch (err) {
        res.status(500).json({success: false, message: err.message})
    }
}
// function to get one user
export const getOneUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById({_id: userId})
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }
        res.json({success: true, message: "User fetched successfully", user})
    } catch (err) {
        res.status(500).json({success: false, message: err.message})
    }
}
// function to update user
export const updateUser = async (req, res) => {
    try {
        const { firstName,lastName, password, email, phoneNumber} = req.body;
        const userId = req.user._id || req.user.userId;
        const imageFile = req.file;

        // find the userById from the user
        const user = await User.findById(userId);
        console.log('User ID:', userId);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }

        const updateUserData = {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,
            password: password || user.password,
            phoneNumber: phoneNumber || user.phoneNumber,
            
        };
        if(imageFile){
            // Delete image from cloudinary
            console.log('Image File Path:', imageFile.path);
            if(user.image && user.imagePublicId) {
                await cloudinary.uploader.destroy(user.imagePublicId);
            }
            // upload new image to cloudinary
            const imageResult = await cloudinary.uploader.upload(imageFile.path);
            console.log('Cloudinary Upload Result:', imageResult);
            updateUserData.image = imageResult.secure_url;
            updateUserData.imagePublicId = imageResult.public_id;
        }
        console.log('Update Data:', updateUserData)
    // Update user data

        // update the fields
        user.firstName = firstName ||user.firstName
        user.lastName = lastName ||user.lastName
        user.email = email || user.email
        user.password = password || user.password
        user.phoneNumber = phoneNumber || user.phoneNumber

        // Update user data
      const updatedUser = await User.findByIdAndUpdate(userId, updateUserData, {
        new: true,
      }).select("-password");
        
        res.json({success: true, message: "User updated successfully", user: updatedUser})
    } catch (err) {
        console.log("Error updating user", err.message)
        res.status(500).json({success: false, error: "Internal server error", message: err.message})
    }
}
// function to delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.deleteOne({_id: userId})
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }
        res.json({success: true, message: "User deleted successfully", user})
    } catch (err) {
        console.log("Error deleting user", err.message)
        res.status(500).json({success: false, error: "Internal server error", message: err.message})
    }
}