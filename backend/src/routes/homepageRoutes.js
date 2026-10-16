import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import {
  getPublicHomepage,
  getAdminHomepage,
  getAdminSection,
  updateAdminSection,
  addSectionItem,
  updateSectionItem,
  deleteSectionItem,
  seedDefaultHomepage,
} from '../controllers/homepageController.js';

const router = express.Router();

// ── Public ──────────────────────────────────────────────
// GET /api/homepage
router.get('/', getPublicHomepage);

// ── Admin protected ──────────────────────────────────────
// POST /api/homepage/admin/seed-default
router.post('/admin/seed-default', protect, requireAdmin, seedDefaultHomepage);

// GET /api/homepage/admin
router.get('/admin', protect, requireAdmin, getAdminHomepage);

// GET  /api/homepage/admin/:sectionId
router.get('/admin/:sectionId', protect, requireAdmin, getAdminSection);

// PUT  /api/homepage/admin/:sectionId
router.put('/admin/:sectionId', protect, requireAdmin, updateAdminSection);

// POST /api/homepage/admin/:sectionId/items
router.post('/admin/:sectionId/items', protect, requireAdmin, addSectionItem);

// PUT  /api/homepage/admin/:sectionId/items/:itemId
router.put('/admin/:sectionId/items/:itemId', protect, requireAdmin, updateSectionItem);

// DELETE /api/homepage/admin/:sectionId/items/:itemId
router.delete('/admin/:sectionId/items/:itemId', protect, requireAdmin, deleteSectionItem);

export default router;
