const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is working!' });
});

// NO app.listen() here!
module.exports = app;