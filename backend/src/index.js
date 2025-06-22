import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from '../routes/auth.route.js'
import messageRoutes from '../routes/message.route.js'
import cors from 'cors'
import { app, server } from '../lib/socket.js';

dotenv.config()



const PORT = process.env.PORT;

app.use(express.json({ limit: '10mb' })); // or even '20mb' based on your needs
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(PORT,()=>{
    console.log(`The Server Is Running on ${PORT}`)
    connectDB()
});