import express from 'express';
import { login, logout, signUp, verifyEmail, forgotPassword, resetPassword, googleAuth} from '../controllers/auth.js';
import { upload } from '../helpers/multer.js';
import { authenticate } from '../middlewares/firebaseAuth.js';

const router = express.Router();

// Route for handling user registration
router.post('/signup', upload.single('image'), signUp);

// Route for verifying user's email
// This route expects a token in the URL parameters and calls the verifyEmail controller function
router.post('/verify-email/:token', verifyEmail);

router.post('/google', authenticate, googleAuth);

// router.post('/resend-token', resendVerificationToken);

// Route for handling user login
router.post('/login', login);

// Route for handling user logout
router.post('/logout', logout);

// Route for initiating the password recovery process
router.post('/forgot-password', forgotPassword);

// Route for resetting the user's password
// This route expects a token in the request body and the new password, then calls the resetPassword controller function
router.post('/reset-password/:resetToken', resetPassword);

export default router;