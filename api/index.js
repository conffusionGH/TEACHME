import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/dbconnection.js';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'; 
dotenv.config();

const PORT = process.env.PORT || 8000;


const ClientURL = process.env.FRONTEND_URL || 'http://localhost:5173';



const app = express();

// Middleware Setup
app.use(cors({
  origin: ClientURL, 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(cookieParser());

console.log(PORT);



const __dirname = path.resolve();


// Database connection and server starting
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
    console.log("Connected to the database");
  });
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);


app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
