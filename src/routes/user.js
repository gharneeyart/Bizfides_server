import express from 'express';
import { login, logout, signUp, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.js';
import { deleteUser, getAllUsers, getOneUser, updateUser } from '../controllers/user.js';


const router = express.Router();

// Route for handling user registration
router.post('/signup', signUp);

// Route for verifying user's email
// This route expects a token in the URL parameters and calls the verifyEmail controller function
router.post('/verify-email/:token', verifyEmail);

// Route for handling user login
router.post('/login', login);

// Route for handling user logout
router.post('/logout', logout);

// Route for initiating the password recovery process
router.post('/forgot-password', forgotPassword);

// Route for resetting the user's password
// This route expects a token in the request body and the new password, then calls the resetPassword controller function
router.post('/reset-password', resetPassword);

// User routes
router.get("/users",getAllUsers)
router.get("/user/:userId",getOneUser)
router.put("/user/update", updateUser )
router.delete("/:userId",deleteUser)

export default router;
