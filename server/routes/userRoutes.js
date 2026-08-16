const express = require('express');
const router = express.Router();
const {
  getUsers,
  blockUser,
  unblockUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateMyProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin only
router.get('/', protect, authorize('admin'), getUsers);
router.patch('/:id/block', protect, authorize('admin'), blockUser);
router.patch('/:id/unblock', protect, authorize('admin'), unblockUser);

// Logged-in user (any role)
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.put('/profile', protect, updateMyProfile);

module.exports = router;