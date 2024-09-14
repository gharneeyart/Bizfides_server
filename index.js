import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './src/configs/db.config.js';
import userRoutes from './src/routes/user.js';
import authRoutes from './src/routes/auth.js';
import googleAuth from './src/routes/googleRoute.js';
import sendRoutes from './src/routes/send.js';
import cors from 'cors';
import session from 'express-session'; // Import express-session
import passport from 'passport';

dotenv.config();

const app = express();
app.use(express.json());

// Set up CORS
let corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://bizfides--eight.vercel.app', 'https://bizfides-server.onrender.com'],
};
app.use(cors(corsOptions));

// Configure express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong secret for production
  resave: false, // Prevent resaving session if unmodified
  saveUninitialized: false, // Don't save uninitialized sessions
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session()); // Persist login sessions

const port = process.env.PORT || 3000;

// Define routes
app.use('/api/v1/auth', authRoutes);
app.use('/auth', googleAuth);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1', sendRoutes);

app.get('/', (req, res) => {
  return res.send('Welcome to bizfides server');
});

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`BizFides Server listening on ${port}`);
});

