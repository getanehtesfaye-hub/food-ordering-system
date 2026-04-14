const { query } = require('./src/config/database');

async function checkAdminUser() {
  try {
    console.log('Checking admin user in database...');
    
    const adminUser = await query('SELECT id, username, email, role FROM users WHERE email = ?', ['admin@foodordering.com']);
    
    if (adminUser.length === 0) {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await query(`
        INSERT INTO users (username, email, password, role) 
        VALUES ('admin', 'admin@foodordering.com', ?, 'admin')
      `, [hashedPassword]);
      
      console.log('✅ Admin user created successfully');
      console.log('Email: admin@foodordering.com');
      console.log('Password: admin123');
    } else {
      console.log('✅ Admin user found:');
      console.log(`- ID: ${adminUser[0].id}`);
      console.log(`- Username: ${adminUser[0].username}`);
      console.log(`- Email: ${adminUser[0].email}`);
      console.log(`- Role: ${adminUser[0].role}`);
      console.log('Login credentials:');
      console.log('- Email: admin@foodordering.com');
      console.log('- Password: admin123');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin user:', error.message);
  } finally {
    process.exit(0);
  }
}

checkAdminUser();
