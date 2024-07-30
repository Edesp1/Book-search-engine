const router = require('express').Router();
const express = require('express');
const path = require('path');
const apiRoutes = require('./api'); // Ensure this path is correct

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API routes
app.use('/api', apiRoutes);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '/client')));

// Serve up React front-end in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

module.exports = router;
