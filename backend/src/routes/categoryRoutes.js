import express from 'express';
import {
  getCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:idOrSlug', getCategoryByIdOrSlug);
router.post('/', protect, requireAdmin, createCategory);
router.put('/:id', protect, requireAdmin, updateCategory);
router.patch('/:id/status', protect, requireAdmin, toggleCategoryStatus);
router.delete('/:id', protect, requireAdmin, deleteCategory);

export default router;
