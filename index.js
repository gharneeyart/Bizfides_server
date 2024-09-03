import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './src/configs/db.config.js';
import userRoutes from './src/routes/user.js'
import authRoutes from './src/routes/auth.js'





dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)


app.listen(port, (req, res) =>{
    connectDB();
    console.log(`BizFides Server listening on ${port}`);
});