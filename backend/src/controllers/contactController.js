import ContactMessage from '../models/ContactMessage.js';
import { sendContactEmail } from '../services/emailService.js';

/**
 * Handle new contact form submission.
 * Route: POST /api/contact
 */
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, topic, message } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!topic || !topic.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a topic.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your message.' });
    }

    let savedContact = null;

    // 1. Save to MongoDB if database is connected
    try {
      if (ContactMessage.db.readyState === 1) {
        savedContact = await ContactMessage.create({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          topic: topic.trim(),
          message: message.trim(),
        });
      } else {
        console.warn('[Contact] Database is not currently connected. Proceeding with email delivery.');
      }
    } catch (dbErr) {
      console.warn('[Contact] Could not persist to database:', dbErr.message);
    }

    // 2. Dispatch Email
    const emailResult = await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic: topic.trim(),
      message: message.trim(),
      createdAt: savedContact ? savedContact.createdAt : new Date(),
    });

    // 3. Update database record with delivery status if saved
    if (savedContact) {
      try {
        if (emailResult.success) {
          savedContact.emailSent = true;
        } else {
          savedContact.emailError = emailResult.error || 'Failed to deliver email';
        }
        await savedContact.save();
      } catch (err) {
        // Non-blocking
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      emailDelivered: emailResult.success,
      data: {
        id: savedContact ? savedContact._id : null,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        topic: topic.trim(),
        createdAt: savedContact ? savedContact.createdAt : new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve contact messages (for admin).
 * Route: GET /api/contact
 */
export const getContactMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments();

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
