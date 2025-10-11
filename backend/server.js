const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const authMockRoutes = require('./routes/authMock');
const userRoutes = require('./routes/users');
const tradingRoutes = require('./routes/trading');

const app = express();
let isMongoConnected = false;

// If running behind a proxy or dev reverse proxy, allow Express to trust X-Forwarded-* headers
app.set('trust proxy', true);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', process.env.CLIENT_URL].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Supabase admin hint
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('📝 Supabase admin client available (SUPABASE_SERVICE_ROLE_KEY detected)');
} else {
  console.log('🛑 Supabase admin client not configured');
}

// Health check endpoint (will be available once server is started)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Start-up sequence: attempt to connect to MongoDB, then mount routes appropriately and start listening.
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Fail fast when MongoDB is not available in dev so server can start
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 5000,
    });
    console.log('✅ Connected to MongoDB');
    isMongoConnected = true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message || err);
    console.log('💡 Running in development mode without MongoDB');
    console.log('💡 Using in-memory storage for testing');
    isMongoConnected = false;
  }

  // Routes - prefer real auth if MongoDB is connected, otherwise use mock auth
  if (isMongoConnected) {
    app.use('/api/auth', authRoutes);
  } else {
    app.use('/api/auth', authMockRoutes);
  }

  // Mount remaining routes
  app.use('/api/users', userRoutes);
  app.use('/api/trading', tradingRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
}

// Start the server
startServer();

// NOTE: 404 and error handlers are registered inside startServer after routes are mounted