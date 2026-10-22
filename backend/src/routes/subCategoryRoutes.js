import express from 'express';
import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  toggleSubCategoryStatus,
  deleteSubCategory,
} from '../controllers/subCategoryController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSubCategories);
router.post('/', protect, requireAdmin, createSubCategory);
router.put('/:id', protect, requireAdmin, updateSubCategory);
router.patch('/:id/status', protect, requireAdmin, toggleSubCategoryStatus);
router.delete('/:id', protect, requireAdmin, deleteSubCategory);

export default router;
