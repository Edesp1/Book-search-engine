const router = require('express').Router();
const apiRoutes = require('./api');

// Use API routes
router.use('/api', apiRoutes);

module.exports = router;