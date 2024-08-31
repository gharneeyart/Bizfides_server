import User from "../models/user.js";
import { comparePassword, hashPassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;

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

        const existingUser = await User.findOne( {email} );
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is taken" });
        }

        const hashed = await hashPassword(password);

        const user = new User({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashed,
        });

        await user.save();
        console.log(user);
        
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400,
        });

        return res.json({ success: true, user, token });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};