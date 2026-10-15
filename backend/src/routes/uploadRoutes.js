import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `prod-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extMatch = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeMatch = allowed.test(file.mimetype);
    if (extMatch && mimeMatch) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed'));
    }
  },
});

const router = express.Router();

// Upload multiple images
router.post('/', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      // Check single file field named 'image' as fallback
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrls = req.files.map((file) => `${protocol}://${host}/uploads/${file.filename}`);

    res.json({
      success: true,
      count: fileUrls.length,
      urls: fileUrls,
      data: fileUrls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Single image upload
router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
