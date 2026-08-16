const Product = require('../models/Product');

// @route GET /api/products
// Public - only approved products, with filters
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating, sellerId } = req.query;

    const filter = {};

    // Public listing only shows approved products
    // UNLESS sellerId is passed (seller viewing their own products, any status)
    if (!sellerId) {
      filter.status = 'approved';
    } else {
      filter.sellerId = sellerId;
    }

    if (category) filter.category = category;
    if (rating) filter.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/:id
// Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/products
// Seller only
const createProduct = async (req, res) => {
  try {
    const {
      name, price, oldPrice, badge, image, images,
      sku, sizes, colors, description, category,
    } = req.body;

    if (!name || !price || !image || !sku || !description || !category) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const product = await Product.create({
      name,
      price,
      oldPrice: oldPrice || null,
      badge: badge || null,
      image,
      images: images || [],
      sku,
      sizes: sizes || [],
      colors: colors || [],
      description,
      category,
      sellerId: req.user._id, // from auth middleware
      status: 'pending',
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/products/:id
// Seller only (own products)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Seller can only edit their own product
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const {
      name, price, oldPrice, badge, image, images,
      sku, sizes, colors, description, category,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (oldPrice !== undefined) product.oldPrice = oldPrice;
    if (badge !== undefined) product.badge = badge;
    if (image !== undefined) product.image = image;
    if (images !== undefined) product.images = images;
    if (sku !== undefined) product.sku = sku;
    if (sizes !== undefined) product.sizes = sizes;
    if (colors !== undefined) product.colors = colors;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;

    // Editing sends it back for approval, since the listing has changed
    product.status = 'pending';

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/products/:id
// Seller only (own products) or admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Seller can only delete their own product; admin can delete any
    if (req.user.role !== 'admin' && product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/products/:id/approve
// Admin only
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/products/:id/reject
// Admin only
const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
};