import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/user.js'; // Adjust the path according to your project structure
import jwt from 'jsonwebtoken';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/v1/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const { id, name, emails } = profile;
  try {
    let user = await User.findOne({ email: emails[0].value });

    // If user exists, but doesn't have Google ID, update the user with the Google ID
    if (user && !user.googleId) {
      user.googleId = id;
      await user.save();
    }

    // If the user doesn't exist, create a new one
    if (!user) {
      user = new User({
        googleId: id,
        firstName: name.givenName,
        lastName: name.familyName,
        email: emails[0].value,
        isVerified: true // Mark as verified since OAuth ensures email validity
      });
      await user.save();
    }

    // Generate JWT and return user info
    const payload = {
      id: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the user information and token
    return done(null, {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        image: user.image,
        role: user.role,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    return done(error, false);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;