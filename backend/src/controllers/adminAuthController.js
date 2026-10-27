import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { ENV } from '../config/env.js';

// ─── In-memory OTP store (per-process; fine for single-server) ───────────────
// Map key: email => { otp, hashedOtp, expiresAt, attempts, purpose }
const otpStore = new Map();

const OTP_EXPIRY_MS   = 10 * 60 * 1000;  // 10 minutes
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;    // 1 minute

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateToken = (id) =>
  jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRE });

const getTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  if (process.env.SMTP_SERVICE === 'gmail' || host.includes('gmail')) {
    return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  }
  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
};

const sendOtpEmail = async (toEmail, otp, purpose = 'login') => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[AdminAuth] SMTP not configured — OTP:', otp);
    return { success: false, error: 'SMTP not configured' };
  }

  const purposeLabel = purpose === 'reset' ? 'Password Reset' : 'Login';
  const from = `"Sree Collections Admin" <${process.env.SMTP_USER}>`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #FAF6EE; margin: 0; padding: 24px; color: #333; }
    .container { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1.5px solid #BB8E43; }
    .header { background: #541A28; padding: 24px 30px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 20px; letter-spacing: 1px; }
    .header p { margin: 6px 0 0; color: #E5C384; font-size: 13px; }
    .content { padding: 30px; text-align: center; }
    .otp-box { display: inline-block; background: #FAF6EE; border: 2px dashed #BB8E43; border-radius: 12px; padding: 16px 40px; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #541A28; margin: 20px 0; }
    .note { font-size: 13px; color: #777; margin-top: 14px; line-height: 1.6; }
    .footer { background: #F8F4ED; padding: 14px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #EDE0CC; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sree Collections</h1>
      <p>Admin Panel — ${purposeLabel} OTP</p>
    </div>
    <div class="content">
      <p style="font-size:15px;color:#541A28;margin:0 0 6px 0;font-weight:600;">Your one-time passcode is:</p>
      <div class="otp-box">${otp}</div>
      <p class="note">
        This OTP is valid for <strong>10 minutes</strong> and can only be used once.<br>
        Do not share this code with anyone.
      </p>
      <p class="note" style="color:#cc3333;">If you did not request this, please ignore this email and secure your account.</p>
    </div>
    <div class="footer">Sree Collections Admin Panel — Automated Security Email</div>
  </div>
</body>
</html>`;

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: `[Sree Collections Admin] ${purposeLabel} OTP: ${otp}`,
      text: `Your admin ${purposeLabel} OTP is: ${otp}\nValid for 10 minutes. Do not share.`,
      html,
    });
    console.log(`[AdminAuth] OTP email sent to ${toEmail}: ${info.messageId}`);
    return { success: true };
  } catch (err) {
    console.error('[AdminAuth] Email send error:', err.message);
    return { success: false, error: err.message };
  }
};

// ─── Password Login ───────────────────────────────────────────────────────────

// POST /api/admin-auth/login
export const adminPasswordLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'admin' }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Admin account is deactivated.' });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar || '' },
    });
  } catch (err) {
    console.error('[adminPasswordLogin]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── OTP Login: Step 1 — Send OTP ────────────────────────────────────────────

// POST /api/admin-auth/send-otp
export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required.' });

    const normEmail = email.toLowerCase().trim();

    // Check admin exists (don't reveal to attacker — always return generic success)
    const user = await User.findOne({ email: normEmail, role: 'admin' });

    // Cooldown check (only if there's a previous entry)
    const existing = otpStore.get(normEmail);
    if (existing && Date.now() - (existing.sentAt || 0) < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.sentAt)) / 1000);
      return res.status(429).json({ success: false, message: `Please wait ${wait}s before resending.` });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    otpStore.set(normEmail, {
      hashedOtp,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
      attempts: 0,
      purpose: 'login',
      sentAt: Date.now(),
    });

    // Send OTP only if user is valid admin (silently skip if not — same response)
    if (user && user.isActive) {
      await sendOtpEmail(normEmail, otp, 'login');
    }

    // Always respond with success to avoid email enumeration
    res.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });
  } catch (err) {
    console.error('[sendLoginOtp]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── OTP Login: Step 2 — Verify OTP ──────────────────────────────────────────

// POST /api/admin-auth/verify-otp
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });

    const normEmail = email.toLowerCase().trim();
    const entry = otpStore.get(normEmail);

    if (!entry || entry.purpose !== 'login')
      return res.status(400).json({ success: false, message: 'No active OTP found. Please request a new one.' });

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(normEmail);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (entry.attempts >= MAX_OTP_ATTEMPTS) {
      otpStore.delete(normEmail);
      return res.status(429).json({ success: false, message: 'Too many incorrect attempts. Request a new OTP.' });
    }

    const inputHash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    if (inputHash !== entry.hashedOtp) {
      entry.attempts += 1;
      const remaining = MAX_OTP_ATTEMPTS - entry.attempts;
      return res.status(400).json({ success: false, message: `Incorrect OTP. ${remaining} attempt(s) remaining.` });
    }

    // OTP valid — invalidate immediately (single-use)
    otpStore.delete(normEmail);

    const user = await User.findOne({ email: normEmail, role: 'admin' });
    if (!user || !user.isActive)
      return res.status(401).json({ success: false, message: 'Admin account not found or deactivated.' });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar || '' },
    });
  } catch (err) {
    console.error('[verifyLoginOtp]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Forgot Password: Step 1 — Send Reset OTP ────────────────────────────────

// POST /api/admin-auth/forgot-password
export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required.' });

    const normEmail = email.toLowerCase().trim();

    const existing = otpStore.get(`reset_${normEmail}`);
    if (existing && Date.now() - (existing.sentAt || 0) < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.sentAt)) / 1000);
      return res.status(429).json({ success: false, message: `Please wait ${wait}s before resending.` });
    }

    const user = await User.findOne({ email: normEmail, role: 'admin' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    otpStore.set(`reset_${normEmail}`, {
      hashedOtp,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
      attempts: 0,
      purpose: 'reset',
      sentAt: Date.now(),
      verified: false,
    });

    if (user && user.isActive) {
      await sendOtpEmail(normEmail, otp, 'reset');
    }

    res.json({ success: true, message: 'If this email is a registered admin, a reset OTP has been sent.' });
  } catch (err) {
    console.error('[sendForgotPasswordOtp]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Forgot Password: Step 2 — Verify Reset OTP ──────────────────────────────

// POST /api/admin-auth/verify-reset-otp
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });

    const normEmail = email.toLowerCase().trim();
    const entry = otpStore.get(`reset_${normEmail}`);

    if (!entry || entry.purpose !== 'reset')
      return res.status(400).json({ success: false, message: 'No active reset OTP found.' });

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(`reset_${normEmail}`);
      return res.status(400).json({ success: false, message: 'OTP has expired.' });
    }

    if (entry.attempts >= MAX_OTP_ATTEMPTS) {
      otpStore.delete(`reset_${normEmail}`);
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
    }

    const inputHash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    if (inputHash !== entry.hashedOtp) {
      entry.attempts += 1;
      return res.status(400).json({ success: false, message: `Incorrect OTP. ${MAX_OTP_ATTEMPTS - entry.attempts} attempt(s) remaining.` });
    }

    // Mark as verified (don't delete yet — needed for reset step)
    entry.verified = true;
    res.json({ success: true, message: 'OTP verified. You may now set a new password.' });
  } catch (err) {
    console.error('[verifyResetOtp]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Forgot Password: Step 3 — Set New Password ──────────────────────────────

// POST /api/admin-auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });

    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });

    const normEmail = email.toLowerCase().trim();
    const entry = otpStore.get(`reset_${normEmail}`);

    if (!entry || !entry.verified || entry.purpose !== 'reset')
      return res.status(400).json({ success: false, message: 'OTP not verified. Please complete OTP verification first.' });

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(`reset_${normEmail}`);
      return res.status(400).json({ success: false, message: 'Session expired. Please start over.' });
    }

    // Re-verify OTP hash
    const inputHash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    if (inputHash !== entry.hashedOtp)
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please start over.' });

    const user = await User.findOne({ email: normEmail, role: 'admin' }).select('+password');
    if (!user)
      return res.status(404).json({ success: false, message: 'Admin not found.' });

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    otpStore.delete(`reset_${normEmail}`);

    res.json({ success: true, message: 'Password reset successfully. Please log in with your new password.' });
  } catch (err) {
    console.error('[resetPassword]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Change Password (authenticated) ─────────────────────────────────────────

// POST /api/admin-auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });

    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });

    if (currentPassword === newPassword)
      return res.status(400).json({ success: false, message: 'New password must be different from current password.' });

    const user = await User.findById(req.user._id).select('+password');
    if (!user)
      return res.status(404).json({ success: false, message: 'Admin not found.' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

    user.password = newPassword; // pre-save hook hashes
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('[changePassword]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Admin Profile: Get & Update ──────────────────────────────────────────────

// GET /api/admin-auth/me
export const getAdminProfile = async (req, res) => {
  try {
    let user = null;
    if (req.user && req.user._id) {
      user = await User.findById(req.user._id).select('-password');
    }
    if (!user) {
      user = await User.findOne({ role: 'admin' }).select('-password');
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
      },
    });
  } catch (err) {
    console.error('[getAdminProfile]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/admin-auth/profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    let user = null;
    if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    }
    if (!user) {
      user = await User.findOne({ role: 'admin' });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim();
    }
    if (typeof avatar === 'string') {
      user.avatar = avatar.trim();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
      },
    });
  } catch (err) {
    console.error('[updateAdminProfile]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

