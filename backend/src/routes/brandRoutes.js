import express from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  toggleBrandStatus,
  deleteBrand,
} from '../controllers/brandController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBrands);
router.post('/', protect, requireAdmin, createBrand);
router.put('/:id', protect, requireAdmin, updateBrand);
router.patch('/:id/status', protect, requireAdmin, toggleBrandStatus);
router.delete('/:id', protect, requireAdmin, deleteBrand);

export default router;
