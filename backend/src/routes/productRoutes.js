import express from 'express';
import {
  getProducts,
  getProductFilterFacets,
  getProductsByCategory,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/filters', getProductFilterFacets);
router.get('/by-category', getProductsByCategory);
router.get('/:idOrSlug', getProductByIdOrSlug);

// Admin protected routes
router.post('/', protect, requireAdmin, createProduct);
router.put('/:id', protect, requireAdmin, updateProduct);
router.patch('/:id/status', protect, requireAdmin, toggleProductStatus);
router.delete('/:id', protect, requireAdmin, deleteProduct);

export default router;
