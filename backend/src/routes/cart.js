const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const { authenticateToken } = require('../middleware/auth');

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

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cartSummary = await Cart.getCartSummary(req.user.id);

    res.json({
      success: true,
      data: cartSummary
    });
  } catch (error) {
    console.error('Get cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
});

// Add item to cart
router.post('/add', [
  authenticateToken,
  body('food_item_id')
    .isInt({ min: 1 })
    .withMessage('Food item ID must be a positive integer'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Quantity must be between 1 and 99')
], handleValidationErrors, async (req, res) => {
  try {
    const { food_item_id, quantity = 1 } = req.body;

    const cart = await Cart.addItem(req.user.id, food_item_id, parseInt(quantity));

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error.message);
    
    if (error.message.includes('not found') || error.message.includes('not available')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding item to cart'
    });
  }
});

// Update item quantity in cart
router.put('/update', [
  authenticateToken,
  body('food_item_id')
    .isInt({ min: 1 })
    .withMessage('Food item ID must be a positive integer'),
  body('quantity')
    .isInt({ min: 0, max: 99 })
    .withMessage('Quantity must be between 0 and 99')
], handleValidationErrors, async (req, res) => {
  try {
    const { food_item_id, quantity } = req.body;

    const cart = await Cart.updateItemQuantity(req.user.id, food_item_id, parseInt(quantity));

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    console.error('Update cart error:', error.message);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
});

// Remove item from cart
router.delete('/remove/:foodItemId', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.removeItem(req.user.id, req.params.foodItemId);

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while removing item from cart'
    });
  }
});

// Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await Cart.clearCart(req.user.id);

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { items: [], total_items: 0, total_price: 0 }
    });
  } catch (error) {
    console.error('Clear cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
});

// Get cart count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const count = await Cart.getCartCount(req.user.id);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get cart count error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart count'
    });
  }
});

// Validate cart for checkout
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    const validation = await Cart.validateCart(req.user.id);

    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('Validate cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while validating cart'
    });
  }
});

// Get checkout cart (validated items only)
router.get('/checkout', authenticateToken, async (req, res) => {
  try {
    const checkoutCart = await Cart.getCheckoutCart(req.user.id);

    res.json({
      success: true,
      data: { items: checkoutCart }
    });
  } catch (error) {
    console.error('Get checkout cart error:', error.message);
    
    if (error.message.includes('no longer available')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while preparing checkout cart'
    });
  }
});

// Merge guest cart (after login)
router.post('/merge', [
  authenticateToken,
  body('guest_cart')
    .isArray()
    .withMessage('Guest cart must be an array'),
  body('guest_cart.*.food_item_id')
    .isInt({ min: 1 })
    .withMessage('Food item ID must be a positive integer'),
  body('guest_cart.*.quantity')
    .isInt({ min: 1, max: 99 })
    .withMessage('Quantity must be between 1 and 99')
], handleValidationErrors, async (req, res) => {
  try {
    const { guest_cart } = req.body;

    const mergedCart = await Cart.mergeGuestCart(req.user.id, guest_cart);

    res.json({
      success: true,
      message: 'Guest cart merged successfully',
      data: mergedCart
    });
  } catch (error) {
    console.error('Merge cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while merging guest cart'
    });
  }
});

module.exports = router;
