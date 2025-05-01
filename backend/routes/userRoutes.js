
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/auth-status', userController.checkAuthStatus);

// Protected routes
router.get('/profile', isAuthenticated, userController.getUserProfile);
router.put('/profile', isAuthenticated, userController.updateUserProfile);
router.delete('/account', isAuthenticated, userController.deleteUserAccount);

module.exports = router;
