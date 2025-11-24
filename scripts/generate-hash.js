const bcrypt = require('bcrypt');

const password = 'password123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL Update:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email IN ('admin@weather.com', 'user@weather.com', 'user2@weather.com');`);
});
