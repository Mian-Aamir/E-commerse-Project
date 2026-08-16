const User = require('../models/User');

// @route GET /api/users
// Admin only - get all users (optionally filter by role)
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = {};
    if (role) filter.role = role; // e.g. ?role=seller or ?role=user

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/users/:id/block
// Admin only
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block an admin account' });
    }

    user.status = 'blocked';
    await user.save();

    res.json({ message: 'User blocked successfully', user: { _id: user._id, status: user.status } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/users/:id/unblock
// Admin only
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'active';
    await user.save();

    res.json({ message: 'User unblocked successfully', user: { _id: user._id, status: user.status } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, blockUser, unblockUser };

const Product = require('../models/Product');

// @route GET /api/users/wishlist
// Logged-in user only
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/users/wishlist/:productId
// Adds a product to the logged-in user's wishlist
const addToWishlist = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(req.params.productId)) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }

    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/users/wishlist/:productId
// Removes a product from the logged-in user's wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/users/profile
// Logged-in user updates their own name/phone
const updateMyProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      storeName: user.storeName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  blockUser,
  unblockUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateMyProfile,
};