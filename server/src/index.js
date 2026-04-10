import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import interviewRoutes from './routes/interview.js';
import reportRoutes from './routes/report.js';
import userRoutes from './routes/user.js';
import aiRoutes from './routes/ai.js';
import { initializeSocket } from './websocket/socketHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT;

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));


const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      user: '/api/user',
      interview: '/api/interview',
      report: '/api/report',
      ai: '/api/ai'
    }
  });
});


app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/ai', aiRoutes);


const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Initialize WebSocket
    initializeSocket(io);

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();