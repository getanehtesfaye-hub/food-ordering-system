const http = require('http');

// Test order data (matching frontend)
const orderData = JSON.stringify({
  items: [
    { food_item_id: 1, quantity: 2, price: 8.99 }
  ],
  delivery_address: 'Test Address',
  phone: '+251953942188',
  notes: 'Test order',
  delivery_type: 'delivery',
  payment_method: 'card',
  subtotal: 17.98,
  tax: 1.44,
  delivery_fee: 4.99,
  total: 24.41
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(orderData),
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3NTI3NDE2NSwiZXhwIjoxNzc1ODc4OTY1fQ.5fofr0NJunhpR0iaR5Nk8ysvXM__eEMCWor_blIax9k'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const parsed = JSON.parse(data);
      if (parsed.success) {
        console.log('✅ Order creation working!');
        console.log('Response structure:', Object.keys(parsed.data));
      } else {
        console.log('❌ Order creation failed:', parsed.message);
      }
    } catch (e) {
      console.log('❌ Invalid JSON response');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(orderData);
req.end();
