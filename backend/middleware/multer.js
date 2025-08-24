import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
const upload = multer({ storage });
export default function handleMulterErrors(req, res, next) {
  upload.array('images', 5)(req, res, function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}
