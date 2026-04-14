const { query, queryOne, insert, execute } = require('../config/database');

class FoodItem {
  // Create new food item
  static async create(foodData) {
    const { name, description, price, category_id, image_url, is_available = true } = foodData;
    
    const foodId = await insert(
      'INSERT INTO food_items (name, description, price, category_id, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category_id, image_url, is_available]
    );
    
    return this.findById(foodId);
  }

  // Find food item by ID
  static async findById(id) {
    return await queryOne(`
      SELECT fi.*, c.name as category_name 
      FROM food_items fi 
      LEFT JOIN categories c ON fi.category_id = c.id 
      WHERE fi.id = ?
    `, [id]);
  }

  // Get all food items
  static async getAll(filters = {}) {
    let sql = `
      SELECT fi.*, c.name as category_name 
      FROM food_items fi 
      LEFT JOIN categories c ON fi.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];
    
    // Filter by category
    if (filters.category_id) {
      sql += ' AND fi.category_id = ?';
      params.push(filters.category_id);
    }
    
    // Filter by availability
    if (filters.is_available !== undefined) {
      sql += ' AND fi.is_available = ?';
      params.push(filters.is_available);
    }
    
    // Search by name
    if (filters.search) {
      sql += ' AND fi.name LIKE ?';
      params.push(`%${filters.search}%`);
    }
    
    // Sort by
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'ASC';
    sql += ` ORDER BY fi.${sortBy} ${sortOrder}`;
    
    // Pagination
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    return await query(sql, params);
  }

  // Update food item
  static async update(id, foodData) {
    const { name, description, price, category_id, image_url, is_available } = foodData;
    const fields = [];
    const values = [];
    
    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    
    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }
    
    if (price !== undefined) {
      fields.push('price = ?');
      values.push(price);
    }
    
    if (category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(category_id);
    }
    
    if (image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(image_url);
    }
    
    if (is_available !== undefined) {
      fields.push('is_available = ?');
      values.push(is_available);
    }
    
    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      await execute(
        `UPDATE food_items SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    return this.findById(id);
  }

  // Delete food item
  static async delete(id) {
    return await execute('DELETE FROM food_items WHERE id = ?', [id]);
  }

  // Get food items by category
  static async getByCategory(categoryId) {
    return await query(`
      SELECT fi.*, c.name as category_name 
      FROM food_items fi 
      LEFT JOIN categories c ON fi.category_id = c.id 
      WHERE fi.category_id = ? AND fi.is_available = true
      ORDER BY fi.name ASC
    `, [categoryId]);
  }

  // Get popular food items (most ordered)
  static async getPopular(limit = 10) {
    return await query(`
      SELECT fi.*, c.name as category_name, COUNT(oi.food_item_id) as order_count
      FROM food_items fi
      LEFT JOIN categories c ON fi.category_id = c.id
      LEFT JOIN order_items oi ON fi.id = oi.food_item_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE fi.is_available = true
      GROUP BY fi.id
      ORDER BY order_count DESC, fi.name ASC
      LIMIT ?
    `, [limit]);
  }

  // Toggle availability
  static async toggleAvailability(id) {
    const foodItem = await this.findById(id);
    if (!foodItem) return null;
    
    const newAvailability = !foodItem.is_available;
    await execute(
      'UPDATE food_items SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newAvailability, id]
    );
    
    return this.findById(id);
  }

  // Get total count
  static async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM food_items WHERE 1=1';
    const params = [];
    
    if (filters.category_id) {
      query += ' AND category_id = ?';
      params.push(filters.category_id);
    }
    
    if (filters.is_available !== undefined) {
      query += ' AND is_available = ?';
      params.push(filters.is_available);
    }
    
    if (filters.search) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.search}%`);
    }
    
    const result = await queryOne(query, params);
    return result.count;
  }
}

module.exports = FoodItem;
