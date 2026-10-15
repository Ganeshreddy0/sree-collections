import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, requireAdmin, getDashboardStats);

export default router;
