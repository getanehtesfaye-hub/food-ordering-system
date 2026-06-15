const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('localhost')) return callback(null, true);
    if (origin.includes('vercel.app')) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check FIRST
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Food Ordering API is running' });
});

// Routes
const authRoutes = require('./src/routes/auth');
const foodRoutes = require('./src/routes/food');
const orderRoutes = require('./src/routes/orders');
const cartRoutes = require('./src/routes/cart');
const userRoutes = require('./src/routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Only listen locally - Vercel handles this in production
if (process.env.NODE_ENV !== 'production') {
  const { testConnection } = require('./src/config/database');
  testConnection();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;