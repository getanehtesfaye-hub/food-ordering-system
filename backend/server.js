const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;