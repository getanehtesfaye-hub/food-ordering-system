const { query, queryOne, insert, execute, beginTransaction, commitTransaction, rollbackTransaction } = require('../config/database');

class Order {
  // Create new order
  static async create(orderData) {
    const connection = await beginTransaction();
    
    try {
      const { user_id, items, delivery_address, phone, notes } = orderData;
      
      // Calculate total amount
      let totalAmount = 0;
      for (const item of items) {
        const foodItem = await queryOne('SELECT price FROM food_items WHERE id = ?', [item.food_item_id]);
        if (!foodItem) {
          throw new Error(`Food item with ID ${item.food_item_id} not found`);
        }
        totalAmount += foodItem.price * item.quantity;
      }
      
      // Create order
      const orderId = await insert(
        'INSERT INTO orders (user_id, total_amount, delivery_address, phone, notes) VALUES (?, ?, ?, ?, ?)',
        [user_id, totalAmount, delivery_address, phone, notes]
      );
      
      // Add order items
      for (const item of items) {
        const foodItem = await queryOne('SELECT price FROM food_items WHERE id = ?', [item.food_item_id]);
        await execute(
          'INSERT INTO order_items (order_id, food_item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.food_item_id, item.quantity, foodItem.price]
        );
      }
      
      // Clear user's cart if logged in
      if (user_id) {
        await execute('DELETE FROM cart WHERE user_id = ?', [user_id]);
      }
      
      await commitTransaction(connection);
      
      return this.findById(orderId);
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  }

  // Find order by ID
  static async findById(id) {
    const order = await queryOne(`
      SELECT o.*, u.username, u.email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `, [id]);
    
    if (order) {
      // Get order items
      order.items = await query(`
        SELECT oi.*, fi.name as food_name, fi.image_url 
        FROM order_items oi 
        LEFT JOIN food_items fi ON oi.food_item_id = fi.id 
        WHERE oi.order_id = ?
      `, [id]);
    }
    
    return order;
  }

  // Get orders by user
  static async getByUser(userId, filters = {}) {
    let sql = `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o 
      WHERE o.user_id = ?
    `;
    const params = [userId];
    
    // Filter by status
    if (filters.status) {
      sql += ' AND o.status = ?';
      params.push(filters.status);
    }
    
    // Sort
    sql += ' ORDER BY o.created_at DESC';
    
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

  // Get all orders (admin)
  static async getAll(filters = {}) {
    let sql = `
      SELECT o.*, u.username, u.email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    
    // Filter by status
    if (filters.status) {
      sql += ' AND o.status = ?';
      params.push(filters.status);
    }
    
    // Filter by date range
    if (filters.start_date) {
      sql += ' AND o.created_at >= ?';
      params.push(filters.start_date);
    }
    
    if (filters.end_date) {
      sql += ' AND o.created_at <= ?';
      params.push(filters.end_date);
    }
    
    // Sort
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    sql += ` ORDER BY o.${sortBy} ${sortOrder}`;
    
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

  // Update order status
  static async updateStatus(id, status) {
    await execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
    
    return this.findById(id);
  }

  // Cancel order
  static async cancel(id) {
    return this.updateStatus(id, 'cancelled');
  }

  // Get order statistics
  static async getStats(filters = {}) {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (filters.start_date) {
      whereClause += ' AND created_at >= ?';
      params.push(filters.start_date);
    }
    
    if (filters.end_date) {
      whereClause += ' AND created_at <= ?';
      params.push(filters.end_date);
    }
    
    const stats = await queryOne(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'preparing' THEN 1 END) as preparing_orders,
        COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders ${whereClause}
    `, params);
    
    return stats;
  }

  // Get daily sales
  static async getDailySales(days = 7) {
    return await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders 
      WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL ? DAY)
        AND status != 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [days]);
  }

  // Get popular items
  static async getPopularItems(limit = 10, filters = {}) {
    let whereClause = 'WHERE o.status != "cancelled"';
    const params = [];
    
    if (filters.start_date) {
      whereClause += ' AND o.created_at >= ?';
      params.push(filters.start_date);
    }
    
    if (filters.end_date) {
      whereClause += ' AND o.created_at <= ?';
      params.push(filters.end_date);
    }
    
    params.push(limit);
    
    return await query(`
      SELECT 
        fi.name,
        fi.image_url,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as total_revenue,
        COUNT(DISTINCT oi.order_id) as order_count
      FROM order_items oi
      LEFT JOIN food_items fi ON oi.food_item_id = fi.id
      LEFT JOIN orders o ON oi.order_id = o.id
      ${whereClause}
      GROUP BY oi.food_item_id
      ORDER BY total_sold DESC
      LIMIT ?
    `, params);
  }

  // Get total count
  static async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM orders WHERE 1=1';
    const params = [];
    
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    
    if (filters.user_id) {
      query += ' AND user_id = ?';
      params.push(filters.user_id);
    }
    
    const result = await queryOne(query, params);
    return result.count;
  }
}

module.exports = Order;
