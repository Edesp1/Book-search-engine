require('dotenv').config();
const mongoose = require('mongoose');

// Remove useNewUrlParser and useUnifiedTopology as they are deprecated
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;