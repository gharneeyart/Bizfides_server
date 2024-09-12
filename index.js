import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './src/configs/db.config.js';
import userRoutes from './src/routes/user.js'
import authRoutes from './src/routes/auth.js'
import sendRoutes from './src/routes/send.js'
import cors from 'cors'; 



dotenv.config();

const app = express();
app.use(express.json());

// COOP and CORS Configuration
// app.use((req, res, next) => {
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // If needed
//     next();
//   });

let corsOptions = { 
    origin : ['http://localhost:5173', 'http://localhost:5174', 'https://bizfides--eight.vercel.app', 'https://bizfides-server.onrender.com'], 
    // methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods if needed
    // allowedHeaders: ['Content-Type', 'Authorization'] 
} 
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

app.use('/api/v1/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api',sendRoutes)

app.get('/', (req, res) =>{
    return res.send('Welcome to bizfides server')});


app.listen(port, (req, res) =>{
    connectDB();
    console.log(`BizFides Server listening on ${port}`);
});