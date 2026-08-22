const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// Accepts up to 5 images sent under the field name "images"
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

module.exports = upload;