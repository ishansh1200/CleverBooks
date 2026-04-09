import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Route Imports
import { settlementRoutes } from './routes/settlements';
import { logRoutes } from './routes/logs';

// Background Service Imports
import { initCronJobs } from './services/reconciliationService';
import { initWorker } from './workers/notificationWorker';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cleverbooks';

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/settlements', settlementRoutes);
app.use('/api/logs', logRoutes);

// --- Server Initialization ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('--- System Online ---');
    console.log('Connected to MongoDB.');

    // 1. Initialize the Nightly Reconciliation Scheduler (2:00 AM IST)
    initCronJobs();

    // 2. Initialize the BullMQ Notification Worker
    initWorker();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });