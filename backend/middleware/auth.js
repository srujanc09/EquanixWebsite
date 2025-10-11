const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase admin client if service role key is provided
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseAdmin = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Verify JWT token middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }
    // Try to verify as our server JWT first
    let user = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from database
      user = await User.findById(decoded.userId).select('-password');
    } catch (err) {
      // If server JWT verification failed, try Supabase verification (if configured)
      if (supabaseAdmin) {
        try {
          // Verify JWT via Supabase admin endpoint
          const { data, error } = await supabaseAdmin.auth.getUser(token);
          if (!error && data?.user) {
            const supaUser = data.user;
            // If mongoose is connected, find or create a local User document for this Supabase user
            const mongoConnected = mongoose?.connection?.readyState === 1;
            if (mongoConnected) {
              user = await User.findOne({ email: supaUser.email.toLowerCase() }).select('-password');
              if (!user) {
                // Create a minimal local user record
                const newUser = new User({
                  name: supaUser.user_metadata?.name || supaUser.email.split('@')[0],
                  email: supaUser.email.toLowerCase(),
                  password: Math.random().toString(36), // dummy password; won't be used
                  avatar: supaUser.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(supaUser.user_metadata?.name || supaUser.email.split('@')[0])}&background=667eea&color=fff`,
                  isEmailVerified: !!supaUser.email_confirmed_at
                });
                // Mark password field as set but hashed by pre-save hook
                await newUser.save();
                user = newUser;
              }
            } else {
              // Mongo isn't connected — create an in-memory user shape that routes expect
              const fullProfile = {
                id: supaUser.id,
                name: supaUser.user_metadata?.name || supaUser.email.split('@')[0],
                email: supaUser.email,
                avatar: supaUser.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(supaUser.user_metadata?.name || supaUser.email.split('@')[0])}&background=667eea&color=fff`,
                subscription: 'free',
                profile: { preferences: { theme: 'dark', notifications: { email: true, push: true, trading: true }, defaultCurrency: 'USD' } },
                tradingStats: { totalStrategies: 0, totalBacktests: 0, winRate: 0, totalPnL: 0, lastActiveDate: new Date() },
                isEmailVerified: !!supaUser.email_confirmed_at,
                createdAt: new Date(),
                lastLogin: new Date()
              };

              user = {
                _id: supaUser.id,
                isActive: true,
                fullProfile,
                // minimal methods used by routes — no persistence
                updateLastLogin: async function() { this.fullProfile.lastLogin = new Date(); return this; },
                removeRefreshToken: async function() { return this; },
                save: async function() { return this; }
              };
            }
          }
        } catch (supaErr) {
          // ignore Supabase verification errors here and fall through
          console.debug('Supabase admin token verify error:', supaErr?.message || supaErr);
        }
      }
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user has specific subscription level
const requireSubscription = (minLevel) => {
  const levels = { free: 0, pro: 1, enterprise: 2 };
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userLevel = levels[req.user.subscription] || 0;
    const requiredLevel = levels[minLevel] || 0;
    
    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `${minLevel} subscription required`,
        currentSubscription: req.user.subscription,
        requiredSubscription: minLevel
      });
    }
    
    next();
  };
};

module.exports = {
  auth,
  optionalAuth,
  requireSubscription
};