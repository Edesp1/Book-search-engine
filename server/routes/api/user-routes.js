const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user-controller');

// Signup route
router.post('/signup', userController.createUser);

// Login route
router.post('/login', userController.login);

// Get a single user
router.get('/:id', userController.getSingleUser);

// Save a book
router.post('/saveBook', userController.saveBook);

// Delete a book
router.delete('/deleteBook/:bookId', userController.deleteBook);

module.exports = router;