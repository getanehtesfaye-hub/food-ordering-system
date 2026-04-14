const { query, queryOne, insert, execute } = require('../config/database');

class Category {
  // Create new category
  static async create(categoryData) {
    const { name, description, image_url } = categoryData;
    
    const categoryId = await insert(
      'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
      [name, description, image_url]
    );
    
    return this.findById(categoryId);
  }

  // Find category by ID
  static async findById(id) {
    return await queryOne(`
      SELECT c.*, COUNT(fi.id) as item_count
      FROM categories c
      LEFT JOIN food_items fi ON c.id = fi.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);
  }

  // Get all categories
  static async getAll() {
    return await query(`
      SELECT c.*, COUNT(fi.id) as item_count
      FROM categories c
      LEFT JOIN food_items fi ON c.id = fi.category_id AND fi.is_available = true
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
  }

  // Update category
  static async update(id, categoryData) {
    const { name, description, image_url } = categoryData;
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
    
    if (image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(image_url);
    }
    
    if (fields.length > 0) {
      values.push(id);
      
      await execute(
        `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    return this.findById(id);
  }

  // Delete category
  static async delete(id) {
    // Check if category has food items
    const foodItems = await queryOne(
      'SELECT COUNT(*) as count FROM food_items WHERE category_id = ?',
      [id]
    );
    
    if (foodItems.count > 0) {
      throw new Error('Cannot delete category with existing food items');
    }
    
    return await execute('DELETE FROM categories WHERE id = ?', [id]);
  }

  // Find category by name
  static async findByName(name) {
    return await queryOne('SELECT * FROM categories WHERE name = ?', [name]);
  }

  // Get categories with food items
  static async getWithFoodItems() {
    return await query(`
      SELECT c.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', fi.id,
            'name', fi.name,
            'description', fi.description,
            'price', fi.price,
            'image_url', fi.image_url,
            'is_available', fi.is_available
          )
        ) as food_items
      FROM categories c
      LEFT JOIN food_items fi ON c.id = fi.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
  }

  // Get popular categories (with most orders)
  static async getPopular(limit = 10) {
    return await query(`
      SELECT c.*, COUNT(oi.food_item_id) as order_count
      FROM categories c
      LEFT JOIN food_items fi ON c.id = fi.category_id
      LEFT JOIN order_items oi ON fi.id = oi.food_item_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
      GROUP BY c.id
      HAVING order_count > 0
      ORDER BY order_count DESC
      LIMIT ?
    `, [limit]);
  }

  // Toggle category visibility (by toggling all food items availability)
  static async toggleVisibility(id) {
    const category = await this.findById(id);
    if (!category) return null;
    
    // Get current availability of food items in this category
    const foodItems = await query(
      'SELECT is_available FROM food_items WHERE category_id = ?',
      [id]
    );
    
    const allAvailable = foodItems.length > 0 && foodItems.every(item => item.is_available);
    const newAvailability = !allAvailable;
    
    // Update all food items in this category
    await execute(
      'UPDATE food_items SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE category_id = ?',
      [newAvailability, id]
    );
    
    return this.findById(id);
  }

  // Get total count
  static async getCount() {
    const result = await queryOne('SELECT COUNT(*) as count FROM categories');
    return result.count;
  }
}

module.exports = Category;
