const Order = require('../models/Order');
const Product = require('../models/Product');

// @route POST /api/orders
// Logged-in user only
const createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    if (!address || !paymentMethod) {
      return res.status(400).json({ message: 'Address and payment method are required' });
    }

    // Look up sellerId for each item from the actual Product record
    // (never trust sellerId if the client sent one)
    const enrichedItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      enrichedItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        price: product.price,
        image: product.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity || 1,
      });

      total += product.price * (item.quantity || 1);
    }

    const order = await Order.create({
      userId: req.user._id,
      items: enrichedItems,
      address,
      paymentMethod,
      total,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders
// - Admin: sees all orders
// - User: sees only their own orders
// - Seller: sees orders containing their products (via ?sellerId=own id)
const getOrders = async (req, res) => {
  try {
    const { userId, sellerId } = req.query;

    let filter = {};

    if (req.user.role === 'admin') {
      // Admin can optionally filter, otherwise sees everything
      if (userId) filter.userId = userId;
    } else if (req.user.role === 'seller') {
      // Seller can only ever see their own orders, ignore any userId param
      filter['items.sellerId'] = req.user._id;
    } else {
      // Regular user can only ever see their own orders
      filter.userId = req.user._id;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Access control: user can only view their own order,
    // seller only if their product is in it, admin sees all
    const isOwner = order.userId.toString() === req.user._id.toString();
    const isSellerInOrder = order.items.some(
      (item) => item.sellerId.toString() === req.user._id.toString()
    );

    if (req.user.role !== 'admin' && !isOwner && !isSellerInOrder) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/orders/:id/status
// Admin or seller (only for their own items' orders) can update status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isSellerInOrder = order.items.some(
      (item) => item.sellerId.toString() === req.user._id.toString()
    );

    if (req.user.role !== 'admin' && !isSellerInOrder) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };