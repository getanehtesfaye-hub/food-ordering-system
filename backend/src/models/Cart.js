const { query, queryOne, insert, execute } = require('../config/database');

class Cart {
  // Add item to cart
  static async addItem(userId, foodItemId, quantity = 1) {
    // Check if food item exists and is available
    const foodItem = await queryOne(
      'SELECT id, name, price, is_available FROM food_items WHERE id = ?',
      [foodItemId]
    );
    
    if (!foodItem) {
      throw new Error('Food item not found');
    }
    
    if (!foodItem.is_available) {
      throw new Error('Food item is not available');
    }
    
    // Check if item already exists in cart
    const existingItem = await queryOne(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND food_item_id = ?',
      [userId, foodItemId]
    );
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      await execute(
        'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantity, existingItem.id]
      );
    } else {
      // Add new item
      await insert(
        'INSERT INTO cart (user_id, food_item_id, quantity) VALUES (?, ?, ?)',
        [userId, foodItemId, quantity]
      );
    }
    
    return this.getUserCart(userId);
  }

  // Get user's cart
  static async getUserCart(userId) {
    return await query(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        fi.id as food_id,
        fi.name,
        fi.description,
        fi.price,
        fi.image_url,
        fi.is_available,
        cat.name as category_name
      FROM cart c
      LEFT JOIN food_items fi ON c.food_item_id = fi.id
      LEFT JOIN categories cat ON fi.category_id = cat.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [userId]);
  }

  // Update item quantity
  static async updateItemQuantity(userId, foodItemId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, foodItemId);
    }
    
    // Check if item exists in cart
    const existingItem = await queryOne(
      'SELECT id FROM cart WHERE user_id = ? AND food_item_id = ?',
      [userId, foodItemId]
    );
    
    if (!existingItem) {
      throw new Error('Item not found in cart');
    }
    
    await execute(
      'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quantity, existingItem.id]
    );
    
    return this.getUserCart(userId);
  }

  // Remove item from cart
  static async removeItem(userId, foodItemId) {
    await execute(
      'DELETE FROM cart WHERE user_id = ? AND food_item_id = ?',
      [userId, foodItemId]
    );
    
    return this.getUserCart(userId);
  }

  // Clear entire cart
  static async clearCart(userId) {
    await execute('DELETE FROM cart WHERE user_id = ?', [userId]);
    return [];
  }

  // Get cart summary (total items, total price)
  static async getCartSummary(userId) {
    const cartItems = await this.getUserCart(userId);
    
    let totalItems = 0;
    let totalPrice = 0;
    let unavailableItems = 0;
    
    for (const item of cartItems) {
      if (item.is_available) {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
      } else {
        unavailableItems++;
      }
    }
    
    return {
      total_items: totalItems,
      total_price: totalPrice,
      unavailable_items: unavailableItems,
      items: cartItems
    };
  }

  // Remove unavailable items from cart
  static async removeUnavailableItems(userId) {
    await execute(`
      DELETE c FROM cart c
      LEFT JOIN food_items fi ON c.food_item_id = fi.id
      WHERE c.user_id = ? AND (fi.id IS NULL OR fi.is_available = false)
    `, [userId]);
    
    return this.getUserCart(userId);
  }

  // Get cart count (total number of items)
  static async getCartCount(userId) {
    const result = await queryOne(`
      SELECT SUM(quantity) as count FROM cart c
      LEFT JOIN food_items fi ON c.food_item_id = fi.id
      WHERE c.user_id = ? AND fi.is_available = true
    `, [userId]);
    
    return result.count || 0;
  }

  // Validate cart items before checkout
  static async validateCart(userId) {
    const cartItems = await this.getUserCart(userId);
    const unavailableItems = [];
    
    for (const item of cartItems) {
      if (!item.is_available) {
        unavailableItems.push({
          food_id: item.food_id,
          name: item.name,
          reason: 'Item is no longer available'
        });
      }
    }
    
    return {
      is_valid: unavailableItems.length === 0,
      unavailable_items: unavailableItems,
      valid_items: cartItems.filter(item => item.is_available)
    };
  }

  // Merge guest cart with user cart (after login)
  static async mergeGuestCart(userId, guestCartItems) {
    for (const item of guestCartItems) {
      try {
        await this.addItem(userId, item.food_item_id, item.quantity);
      } catch (error) {
        // Skip items that are no longer available
        console.warn(`Failed to merge cart item: ${error.message}`);
      }
    }
    
    return this.getUserCart(userId);
  }

  // Get cart for checkout (with validation)
  static async getCheckoutCart(userId) {
    const validation = await this.validateCart(userId);
    
    if (!validation.is_valid) {
      // Remove unavailable items
      await this.removeUnavailableItems(userId);
      throw new Error('Some items in your cart are no longer available');
    }
    
    return validation.valid_items;
  }
}

module.exports = Cart;
