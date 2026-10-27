import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: storefront can fetch shipping fee
router.get('/', getSettings);

// Admin only: update store settings
router.put('/', protect, requireAdmin, updateSettings);

export default router;
