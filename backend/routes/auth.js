const express = require('express');
const router = express.Router();
const { 
  registerClient, 
  registerProvider, 
  registerAdmin, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Register routes
router.post('/client/signup', registerClient);
router.post('/provider/signup', registerProvider);
router.post('/admin/signup', protect, authorize('admin'), registerAdmin); // Only admins can create other admins

// Login route
router.post('/login', login);

// Get current user
router.get('/me', protect, getMe);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

module.exports = router;