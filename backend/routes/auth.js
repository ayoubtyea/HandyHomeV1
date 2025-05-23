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

// Register routes - Only client signup is public
router.post('/signup', registerClient); // Public client signup
router.post('/client/signup', registerClient); // Alternative client signup route

// Provider and Admin registrations are protected
router.post('/provider/signup', protect, authorize('admin'), registerProvider); // Only admins can create providers
router.post('/admin/signup', protect, authorize('admin'), registerAdmin); // Only admins can create other admins

// Login route - All users can login (client, provider, admin)
router.post('/login', login);

// Get current user - Protected route
router.get('/me', protect, getMe);

// Password reset routes - Public
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

module.exports = router;