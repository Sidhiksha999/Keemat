import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { initSocketService } from './services/socketService.js';
import { seedDatabase } from './scripts/seed.js';
import { isMongoConnected } from './services/dataStore.js';

import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import escrowRoutes from './routes/escrowRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/ai', aiRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Initialize Socket.io
initSocketService(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 KEEMAT BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 Socket.io live bidding engine initialized`);
  console.log(`====================================================`);
});

// Async DB Connection & Seed
connectDB().then(async () => {
  if (isMongoConnected()) {
    try {
      await seedDatabase();
    } catch (e) {
      console.warn('[Seed] Seed warning:', e.message);
    }
  } else {
    console.log('[DataStore] Active in persistent data store mode.');
  }
}).catch(err => {
  console.warn('[DB] DB async init warning:', err.message);
});
