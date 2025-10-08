const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.fullProfile
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('profile.bio').optional().isLength({ max: 500 }),
  body('profile.location').optional().isLength({ max: 100 }),
  body('profile.website').optional().isURL(),
  body('profile.tradingExperience').optional().isIn(['beginner', 'intermediate', 'advanced', 'professional'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, profile } = req.body;
    const user = req.user;

    // Update basic info
    if (name) user.name = name.trim();
    
    // Update profile fields
    if (profile) {
      if (profile.bio !== undefined) user.profile.bio = profile.bio;
      if (profile.location !== undefined) user.profile.location = profile.location;
      if (profile.website !== undefined) user.profile.website = profile.website;
      if (profile.tradingExperience !== undefined) user.profile.tradingExperience = profile.tradingExperience;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.fullProfile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  auth,
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  body('notifications.email').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  body('notifications.trading').optional().isBoolean(),
  body('defaultCurrency').optional().isLength({ min: 3, max: 3 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { theme, notifications, defaultCurrency } = req.body;
    const user = req.user;

    // Update preferences
    if (theme !== undefined) user.profile.preferences.theme = theme;
    if (defaultCurrency !== undefined) user.profile.preferences.defaultCurrency = defaultCurrency.toUpperCase();
    
    if (notifications) {
      if (notifications.email !== undefined) user.profile.preferences.notifications.email = notifications.email;
      if (notifications.push !== undefined) user.profile.preferences.notifications.push = notifications.push;
      if (notifications.trading !== undefined) user.profile.preferences.notifications.trading = notifications.trading;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.profile.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
});

// @route   PUT /api/users/subscription
// @desc    Update user subscription (mock implementation)
// @access  Private
router.put('/subscription', [
  auth,
  body('subscription').isIn(['free', 'pro', 'enterprise'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { subscription } = req.body;
    const user = req.user;

    // In a real app, you'd integrate with payment processing here
    user.subscription = subscription;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: {
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscription'
    });
  }
});

// @route   GET /api/users/trading-stats
// @desc    Get user trading statistics
// @access  Private
router.get('/trading-stats', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        stats: req.user.tradingStats
      }
    });
  } catch (error) {
    console.error('Get trading stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trading statistics'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Soft delete - just deactivate the account
    user.isActive = false;
    user.refreshTokens = []; // Clear all refresh tokens
    await user.save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating account'
    });
  }
});

module.exports = router;