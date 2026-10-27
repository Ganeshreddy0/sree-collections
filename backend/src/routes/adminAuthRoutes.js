import express from 'express';
import {
  adminPasswordLogin,
  sendLoginOtp,
  verifyLoginOtp,
  sendForgotPasswordOtp,
  verifyResetOtp,
  resetPassword,
  changePassword,
  getAdminProfile,
  updateAdminProfile,
} from '../controllers/adminAuthController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── Profile management (authenticated) ─────────────────────────────────────
router.get('/me', protect, getAdminProfile);
router.put('/profile', protect, updateAdminProfile);

// ── Password login ─────────────────────────────────────────────────────────
router.post('/login', adminPasswordLogin);

// ── OTP login ──────────────────────────────────────────────────────────────
router.post('/send-otp',    sendLoginOtp);
router.post('/verify-otp',  verifyLoginOtp);

// ── Forgot / reset password (public) ───────────────────────────────────────
router.post('/forgot-password',   sendForgotPasswordOtp);
router.post('/verify-reset-otp',  verifyResetOtp);
router.post('/reset-password',    resetPassword);

// ── Change password (must be authenticated) ────────────────────────────────
router.post('/change-password', protect, changePassword);

export default router;
