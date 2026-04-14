const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const FoodItem = require('../models/FoodItem');
const Category = require('../models/Category');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'food-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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

// Get all food items (public route)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category_id,
      is_available,
      search,
      sortBy = 'name',
      sortOrder = 'ASC',
      page = 1,
      limit = 20
    } = req.query;

    const filters = {
      category_id: category_id ? parseInt(category_id) : undefined,
      is_available: is_available !== undefined ? is_available === 'true' : true,
      search,
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const foodItems = await FoodItem.getAll(filters);
    const totalCount = await FoodItem.getCount({
      category_id: filters.category_id,
      is_available: filters.is_available,
      search: filters.search
    });

    res.json({
      success: true,
      data: {
        food_items: foodItems,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get food items error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching food items'
    });
  }
});

// Get single food item (public route)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.json({
      success: true,
      data: { food_item: foodItem }
    });
  } catch (error) {
    console.error('Get food item error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching food item'
    });
  }
});

// Create food item (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('is_available')
    .optional()
    .isBoolean()
    .withMessage('is_available must be a boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const { name, description, price, category_id, is_available } = req.body;
    
    // Check if category exists
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const foodItem = await FoodItem.create({
      name,
      description,
      price: parseFloat(price),
      category_id: parseInt(category_id),
      image_url,
      is_available: is_available !== undefined ? is_available : true
    });

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: { food_item: foodItem }
    });
  } catch (error) {
    console.error('Create food item error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating food item'
    });
  }
});

// Update food item (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('is_available')
    .optional()
    .isBoolean()
    .withMessage('is_available must be a boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const { name, description, price, category_id, is_available } = req.body;
    
    // Check if food item exists
    const existingFoodItem = await FoodItem.findById(req.params.id);
    if (!existingFoodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check if category exists (if provided)
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category_id !== undefined) updateData.category_id = parseInt(category_id);
    if (is_available !== undefined) updateData.is_available = is_available;
    if (req.file) updateData.image_url = `/uploads/${req.file.filename}`;

    const foodItem = await FoodItem.update(req.params.id, updateData);

    res.json({
      success: true,
      message: 'Food item updated successfully',
      data: { food_item: foodItem }
    });
  } catch (error) {
    console.error('Update food item error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating food item'
    });
  }
});

// Delete food item (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    // Check if food item exists
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    await FoodItem.delete(req.params.id);

    res.json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('Delete food item error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting food item'
    });
  }
});

// Toggle food item availability (admin only)
router.patch('/:id/toggle-availability', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const foodItem = await FoodItem.toggleAvailability(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.json({
      success: true,
      message: `Food item ${foodItem.is_available ? 'enabled' : 'disabled'} successfully`,
      data: { food_item: foodItem }
    });
  } catch (error) {
    console.error('Toggle availability error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling food item availability'
    });
  }
});

// Get popular food items (public route)
router.get('/popular/list', optionalAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const popularItems = await FoodItem.getPopular(parseInt(limit));

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

// Get food items by category (public route)
router.get('/category/:categoryId', optionalAuth, async (req, res) => {
  try {
    const foodItems = await FoodItem.getByCategory(req.params.categoryId);

    res.json({
      success: true,
      data: { food_items: foodItems }
    });
  } catch (error) {
    console.error('Get food items by category error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching food items by category'
    });
  }
});

module.exports = router;
