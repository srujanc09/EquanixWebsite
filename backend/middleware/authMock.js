const jwt = require('jsonwebtoken');
const { findUserById } = require('../utils/mockDb');

// Mock auth middleware for development without MongoDB
const authMock = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Development helper: allow simple mock tokens of the form "mock:<email>" or "id:<numeric>"
    // This avoids needing a signed JWT during local testing.
    if (process.env.NODE_ENV !== 'production') {
      if (token.startsWith('mock:')) {
        const email = token.split(':')[1] || `devuser${Date.now()}@local.test`;
        // find or create a mock user with this email
        let user = findUserByEmail(email);
        if (!user) {
          user = addUser({ name: email.split('@')[0], email });
        }
        req.user = user;
        return next();
      }
      if (token.startsWith('id:')) {
        const id = token.split(':')[1];
        let user = findUserById(id);
        if (!user) {
          user = addUser({ name: `devuser${id}`, email: `dev+${id}@local.test` });
        }
        req.user = user;
        return next();
      }
    }

    // Verify token using configured secret (falls back to a safe dev secret if not provided)
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
    const decoded = jwt.verify(token, secret);

    // Get user from mock database
    const user = findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
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

module.exports = { authMock };