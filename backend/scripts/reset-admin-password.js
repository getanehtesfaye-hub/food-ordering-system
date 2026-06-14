require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { execute, closePool } = require('../src/config/database');

async function resetAdminPassword() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const updated = await execute(
    'UPDATE users SET password = ? WHERE email = ?',
    [hashedPassword, 'admin@foodordering.com']
  );

  if (updated === 0) {
    await execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@foodordering.com', hashedPassword, 'admin']
    );
    console.log('Admin user created');
  } else {
    console.log('Admin password reset');
  }

  console.log('Email: admin@foodordering.com');
  console.log('Password: admin123');
}

resetAdminPassword()
  .then(() => closePool())
  .catch((err) => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
