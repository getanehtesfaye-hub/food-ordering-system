const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Create new order
router.post('/', [
  authenticateToken,
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.food_item_id')
    .isInt({ min: 1 })
    .withMessage('Food item ID must be a positive integer'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('delivery_address')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Delivery address must be between 5 and 500 characters'),
  body('phone')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Please provide a valid phone number'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const { items, delivery_address, phone, notes } = req.body;

    // Validate cart items
    const cartValidation = await Cart.validateCart(req.user.id);
    if (!cartValidation.is_valid) {
      return res.status(400).json({
        success: false,
        message: 'Some items in your cart are no longer available',
        data: { unavailable_items: cartValidation.unavailable_items }
      });
    }

    const order = await Order.create({
      user_id: req.user.id,
      items,
      delivery_address,
      phone,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error.message);
    
    if (error.message.includes('not found')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while placing order'
    });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10
    } = req.query;

    const filters = {
      status,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const orders = await Order.getByUser(req.user.id, filters);
    const totalCount = await Order.getCount({ user_id: req.user.id, status });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// Get single order
router.get('/:id', [authenticateToken, optionalAuth], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is admin or order belongs to user
    if (req.user) {
      if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else {
      // Guest users can only access their own orders (this would require additional logic for guest orders)
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// Update order status (admin only)
router.patch('/:id/status', [
  authenticateToken,
  requireAdmin,
  body('status')
    .isIn(['pending', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
], handleValidationErrors, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.updateStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// Cancel order (user's own orders only)
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    // Get order first to check ownership
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user or user is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'preparing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    const cancelledOrder = await Order.cancel(req.params.id);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order: cancelledOrder }
    });
  } catch (error) {
    console.error('Cancel order error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

// Get all orders (admin only)
router.get('/', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const {
      status,
      start_date,
      end_date,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    const filters = {
      status,
      start_date,
      end_date,
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const orders = await Order.getAll(filters);
    const totalCount = await Order.getCount({ status });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// Get order statistics (admin only)
router.get('/stats/summary', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const filters = {};
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;

    const stats = await Order.getStats(filters);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get order stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics'
    });
  }
});

// Get daily sales (admin only)
router.get('/stats/daily', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const dailySales = await Order.getDailySales(parseInt(days));

    res.json({
      success: true,
      data: { daily_sales: dailySales }
    });
  } catch (error) {
    console.error('Get daily sales error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching daily sales'
    });
  }
});

// Get popular items (admin only)
router.get('/stats/popular-items', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { limit = 10, start_date, end_date } = req.query;

    const filters = {};
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;

    const popularItems = await Order.getPopularItems(parseInt(limit), filters);

    res.json({
      success: true,
      data: { popular_items: popularItems }
    });
  } catch (error) {
    console.error('Get popular items error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching popular items'
    });
  }
});

module.exports = router;
