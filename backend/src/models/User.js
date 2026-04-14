const bcrypt = require('bcryptjs');
const { query, queryOne, insert, execute } = require('../config/database');

class User {
  // Create new user
  static async create(userData) {
    const { username, email, password, phone, address, role = 'user' } = userData;
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const userId = await insert(
      'INSERT INTO users (username, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, address, role]
    );
    
    return this.findById(userId);
  }

  // Find user by ID
  static async findById(id) {
    return await queryOne(
      'SELECT id, username, email, phone, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
  }

  // Find user by email
  static async findByEmail(email) {
    return await queryOne('SELECT * FROM users WHERE email = ?', [email]);
  }

  // Find user by username
  static async findByUsername(username) {
    return await queryOne('SELECT * FROM users WHERE username = ?', [username]);
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user profile
  static async updateProfile(id, userData) {
    const { username, phone, address } = userData;
    const fields = [];
    const values = [];
    
    if (username) {
      fields.push('username = ?');
      values.push(username);
    }
    
    if (phone) {
      fields.push('phone = ?');
      values.push(phone);
    }
    
    if (address) {
      fields.push('address = ?');
      values.push(address);
    }
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    values.push(id);
    
    await execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Change password
  static async changePassword(id, newPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }

  // Get all users (admin only)
  static async getAll() {
    return await query(
      'SELECT id, username, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
  }

  // Delete user (admin only)
  static async delete(id) {
    return await execute('DELETE FROM users WHERE id = ?', [id]);
  }

  // Update user role (admin only)
  static async updateRole(id, role) {
    await execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );
    
    return this.findById(id);
  }
}

module.exports = User;
