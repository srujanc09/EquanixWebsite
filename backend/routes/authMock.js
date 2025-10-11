const express = require('express');
const bcrypt = require('bcryptjs');
const { generateTokens, verifyRefreshToken, getRefreshTokenExpiration } = require('../utils/jwt');
const { findUserByEmail, findUserById, addUser } = require('../utils/mockDb');
const { authMock } = require('../middleware/authMock');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (Mock version)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=667eea&color=fff`,
      subscription: 'free'
    };

    const user = addUser(userData);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token in mock user
    try {
      user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + getRefreshTokenExpiration()) });
    } catch (e) {
      // ignore
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.fullProfile,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: process.env.JWT_EXPIRE || '24h'
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (Mock version)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token in mock user
    try {
      user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + getRefreshTokenExpiration()) });
    } catch (e) {
      // ignore
    }
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.fullProfile,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: process.env.JWT_EXPIRE || '24h'
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile (Mock version)
// @access  Private
router.get('/me', authMock, (req, res) => {
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

// @route   POST /api/auth/logout
// @desc    Logout user (Mock version)
// @access  Public
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token (Mock version)
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const user = findUserById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Check if refresh token exists and isn't expired
    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken && new Date(t.expiresAt) > new Date());
    if (!tokenExists) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Replace stored refresh token
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken, expiresAt: new Date(Date.now() + getRefreshTokenExpiration()) });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: process.env.JWT_EXPIRE || '24h'
        }
      }
    });
  } catch (error) {
    console.error('Mock refresh token error:', error);
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

module.exports = router;