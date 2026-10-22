import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  retryWhatsAppNotification,
} from '../controllers/orderController.js';
import { protect, requireAdmin, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

// Customer checkout & viewing placed orders (guest & authenticated)
router.post('/', optionalProtect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', optionalProtect, getOrderById);

// Admin routes
router.get('/', protect, requireAdmin, getAllOrders);
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);
router.post('/:id/retry-whatsapp', protect, requireAdmin, retryWhatsAppNotification);

export default router;
