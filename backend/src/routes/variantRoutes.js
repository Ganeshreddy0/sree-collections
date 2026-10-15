import express from 'express';
import {
  getVariants,
  createVariant,
  updateVariant,
  toggleVariantStatus,
  deleteVariant,
} from '../controllers/variantController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getVariants);
router.post('/', protect, requireAdmin, createVariant);
router.put('/:id', protect, requireAdmin, updateVariant);
router.patch('/:id/status', protect, requireAdmin, toggleVariantStatus);
router.delete('/:id', protect, requireAdmin, deleteVariant);

export default router;
