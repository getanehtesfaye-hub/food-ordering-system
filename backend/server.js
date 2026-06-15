const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  const results = {};
  
  // Test each route file
  try { require('./src/routes/auth'); results.auth = 'OK'; } 
  catch(e) { results.auth = e.message; }
  
  try { require('./src/routes/food'); results.food = 'OK'; } 
  catch(e) { results.food = e.message; }
  
  try { require('./src/routes/orders'); results.orders = 'OK'; } 
  catch(e) { results.orders = e.message; }
  
  try { require('./src/routes/cart'); results.cart = 'OK'; } 
  catch(e) { results.cart = e.message; }
  
  try { require('./src/routes/users'); results.users = 'OK'; } 
  catch(e) { results.users = e.message; }
  
  try { require('./src/config/database'); results.database = 'OK'; } 
  catch(e) { results.database = e.message; }

  res.json(results);
});

module.exports = app;