const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Use API routes
app.use('/api', (req, res, next) => {
  console.log('API route hit:', req.url);
  next();
}, routes);

// The "catchall" handler: for any request that doesn't match one above, send back Vite's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
});