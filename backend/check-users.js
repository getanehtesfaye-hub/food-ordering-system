const { query } = require('./src/config/database');

async function checkUsers() {
  try {
    console.log('Checking users table...');
    
    // Check if admin user exists
    const users = await query('SELECT id, username, email, role FROM users');
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Test login with admin credentials
    const adminUser = await query('SELECT * FROM users WHERE email = ?', ['admin@foodordering.com']);
    if (adminUser.length > 0) {
      console.log('\n✅ Admin user found:');
      console.log('Email:', adminUser[0].email);
      console.log('Username:', adminUser[0].username);
      console.log('Role:', adminUser[0].role);
      console.log('Password hash exists:', adminUser[0].password ? 'Yes' : 'No');
    } else {
      console.log('\n❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkUsers();
