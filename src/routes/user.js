import express from 'express';
import { login, logout, signUp, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.js';
import { deleteUser, getAllUsers, getOneUser, updateUser } from '../controllers/user.js';
import { upload } from '../helpers/multer.js';
import { isLoggedIn } from '../middlewares/auth.js';


const router = express.Router();

// Route for handling user registration
router.post('/signup', upload.single('image'), signUp);

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
// Get all the users
router.get("/users",getAllUsers)
// Get a user by id
router.get("/user/:userId",getOneUser)
// update the user profile. Only a logged in user can update
router.put("/user/update",isLoggedIn, upload.single('image'), updateUser )
// Delete a user
router.delete("/:userId",deleteUser)

export default router;
