import express from 'express';
import { submitContactForm, getContactMessages } from '../controllers/contactController.js';

const router = express.Router();

// Public route to submit contact form
router.post('/', submitContactForm);

// Route to get submitted messages
router.get('/', getContactMessages);

export default router;
