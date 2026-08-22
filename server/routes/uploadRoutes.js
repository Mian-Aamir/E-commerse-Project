const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImages } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('seller'), upload.array('images', 5), uploadImages);

module.exports = router;