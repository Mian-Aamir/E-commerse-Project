const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);

router.put('/:id', protect, authorize('seller'), updateProduct);

router.post('/', protect, authorize('seller'), createProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

router.patch('/:id/approve', protect, authorize('admin'), approveProduct);
router.patch('/:id/reject', protect, authorize('admin'), rejectProduct);

module.exports = router;