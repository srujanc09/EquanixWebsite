# Equanix Backend API

## Setup Instructions

### Prerequisites
1. **Node.js** (v16 or higher)
2. **MongoDB** (v4.4 or higher)

### Installation

1. **Install MongoDB** (if not already installed):
   ```bash
   # On macOS with Homebrew
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   
   # On Ubuntu/Debian
   sudo apt-get install mongodb
   
   # On Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB**:
   ```bash
   # On macOS
   brew services start mongodb-community@7.0
   
   # On Linux
   sudo systemctl start mongod
   
   # Or run manually
   mongod --dbpath /path/to/your/db/directory
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

4. **Environment Configuration**:
   - Copy `.env` and update the values:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT signing
     - `JWT_REFRESH_SECRET`: Another secure random string for refresh tokens

5. **Start the Backend**:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/logout-all` - Logout from all devices
- `GET /api/auth/me` - Get current user

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `PUT /api/users/subscription` - Update subscription
- `GET /api/users/trading-stats` - Get trading statistics
- `DELETE /api/users/account` - Deactivate account

#### Trading
- `GET /api/trading/strategies` - Get user strategies
- `POST /api/trading/strategies` - Create strategy (Pro+ required)
- `GET /api/trading/backtests` - Get backtest results
- `POST /api/trading/backtests` - Run backtest
- `GET /api/trading/portfolio` - Get portfolio data
- `GET /api/trading/market-data/:symbol` - Get market data

### Authentication Flow

1. **Registration/Login**: User receives access token (24h) and refresh token (7d)
2. **API Calls**: Include access token in Authorization header: `Bearer <token>`
3. **Token Refresh**: When access token expires, use refresh token to get new tokens
4. **Logout**: Invalidate refresh tokens

### Database Schema

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  subscription: String (free/pro/enterprise),
  profile: {
    bio: String,
    location: String,
    website: String,
    tradingExperience: String,
    preferences: {
      theme: String,
      notifications: Object,
      defaultCurrency: String
    }
  },
  tradingStats: {
    totalStrategies: Number,
    totalBacktests: Number,
    winRate: Number,
    totalPnL: Number,
    lastActiveDate: Date
  },
  refreshTokens: Array,
  isEmailVerified: Boolean,
  isActive: Boolean,
  timestamps: true
}
```

### Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Access tokens (short-lived) + Refresh tokens (long-lived)
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: express-validator for request validation

### Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Run tests (when implemented)
npm test
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/equanix_trading
JWT_SECRET=your_secure_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
```

### Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets
3. Configure MongoDB Atlas or production MongoDB
4. Set up proper CORS origins
5. Configure rate limiting appropriately
6. Set up monitoring and logging

### Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and accessible
- **JWT Errors**: Check that JWT secrets are set and consistent
- **CORS Issues**: Verify CLIENT_URL matches your frontend URL
- **Rate Limiting**: Check if you're hitting rate limits during development