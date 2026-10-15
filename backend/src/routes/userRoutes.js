import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, requireAdmin, getAllUsers);
router.get('/:id', protect, requireAdmin, getUserById);

export default router;
