import express from 'express';
import passport from '../configs/passport.js';
import { login, logout, signUp, verifyEmail, forgotPassword, resetPassword} from '../controllers/auth.js';
import { upload } from '../helpers/multer.js';

const router = express.Router();




// Route for handling user registration
router.post('/signup', upload.single('image'), signUp);

// Route for verifying user's email
// This route expects a token in the URL parameters and calls the verifyEmail controller function
router.post('/verify-email/:token', verifyEmail);

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



// Route to initiate Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route after successful authentication
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const { token, user } = req.user;
    // Send user information as a query parameter
    res.redirect(`${frontendurl}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  });


export default router;