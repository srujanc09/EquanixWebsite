// Simple in-memory user storage for development without MongoDB
let users = [];
let userIdCounter = 1;

const createMockUser = (userData) => {
  const user = {
    _id: userIdCounter++,
    ...userData,
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true,
    refreshTokens: [],
    tradingStats: {
      totalStrategies: 0,
      totalBacktests: 0,
      winRate: 0,
      totalPnL: 0,
      lastActiveDate: new Date()
    },
    profile: {
      preferences: {
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          trading: true
        },
        defaultCurrency: 'USD'
      }
    }
  };

  // Mock methods
  user.fullProfile = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    subscription: user.subscription,
    profile: user.profile,
    tradingStats: user.tradingStats,
    isEmailVerified: false,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  };

  return user;
};

const findUserByEmail = (email) => {
  return users.find(user => user.email === email.toLowerCase());
};

const findUserById = (id) => {
  return users.find(user => user._id == id);
};

const addUser = (userData) => {
  const user = createMockUser(userData);
  users.push(user);
  return user;
};

module.exports = {
  findUserByEmail,
  findUserById,
  addUser,
  users
};