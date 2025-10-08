const jwt = require('jsonwebtoken');

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Get token expiration time in milliseconds
const getTokenExpirationMs = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

// Calculate refresh token expiration date
const getRefreshTokenExpiration = () => {
  const expirationTime = process.env.JWT_REFRESH_EXPIRE || '7d';
  const ms = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };
  
  const unit = expirationTime.slice(-1);
  const value = parseInt(expirationTime.slice(0, -1));
  
  return ms[unit] * value;
};

module.exports = {
  generateTokens,
  verifyRefreshToken,
  getTokenExpirationMs,
  getRefreshTokenExpiration
};