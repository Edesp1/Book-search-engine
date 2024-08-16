const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user-controller');

// Signup route
router.post('/signup', userController.createUser);

// Login route
router.post('/login', userController.login);

// Get a single user by ID or username (adjust if needed)
router.get('/:id', userController.getSingleUser);

// Save a book (make sure you handle this correctly on the front-end)
router.post('/saveBook', userController.saveBook);

// Delete a book (adjust endpoint if necessary)
router.delete('/deleteBook/:bookId', userController.deleteBook);

module.exports = router;