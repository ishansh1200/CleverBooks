import { Router } from 'express';
import { Job } from '../models/Job';
import { Notification } from '../models/Notification';

const router = Router();

// GET /api/logs/jobs - Fetch the last 10 reconciliation runs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ startTime: -1 }).limit(10);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job logs' });
  }
});

// GET /api/logs/notifications - Fetch the notification delivery history
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification logs' });
  }
});

export const logRoutes = router;