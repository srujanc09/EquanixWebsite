const express = require('express');
const { auth, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/trading/strategies
// @desc    Get user's trading strategies
// @access  Private
router.get('/strategies', auth, async (req, res) => {
  try {
    // Mock trading strategies data
    const strategies = [
      {
        id: '1',
        name: 'Moving Average Crossover',
        description: 'Simple moving average crossover strategy',
        status: 'active',
        performance: {
          totalReturn: 15.6,
          winRate: 67.2,
          sharpeRatio: 1.34,
          maxDrawdown: -8.5
        },
        createdAt: new Date('2024-01-15'),
        lastBacktest: new Date('2024-10-01')
      },
      {
        id: '2',
        name: 'RSI Momentum',
        description: 'RSI-based momentum trading strategy',
        status: 'paused',
        performance: {
          totalReturn: 8.3,
          winRate: 58.9,
          sharpeRatio: 0.89,
          maxDrawdown: -12.1
        },
        createdAt: new Date('2024-02-20'),
        lastBacktest: new Date('2024-09-15')
      }
    ];

    res.json({
      success: true,
      data: {
        strategies,
        total: strategies.length
      }
    });
  } catch (error) {
    console.error('Get strategies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trading strategies'
    });
  }
});

// @route   POST /api/trading/strategies
// @desc    Create new trading strategy
// @access  Private (Pro subscription required)
router.post('/strategies', [auth, requireSubscription('pro')], async (req, res) => {
  try {
    const { name, description, parameters } = req.body;

    // Mock strategy creation
    const newStrategy = {
      id: Date.now().toString(),
      name,
      description,
      parameters,
      status: 'draft',
      performance: {
        totalReturn: 0,
        winRate: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      },
      createdAt: new Date(),
      lastBacktest: null
    };

    // Update user's trading stats
    req.user.tradingStats.totalStrategies += 1;
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Trading strategy created successfully',
      data: {
        strategy: newStrategy
      }
    });
  } catch (error) {
    console.error('Create strategy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trading strategy'
    });
  }
});

// @route   GET /api/trading/backtests
// @desc    Get user's backtest results
// @access  Private
router.get('/backtests', auth, async (req, res) => {
  try {
    // Mock backtest data
    const backtests = [
      {
        id: '1',
        strategyId: '1',
        strategyName: 'Moving Average Crossover',
        startDate: '2023-01-01',
        endDate: '2024-10-01',
        initialCapital: 100000,
        finalValue: 115600,
        totalReturn: 15.6,
        trades: 247,
        winningTrades: 166,
        winRate: 67.2,
        runDate: new Date('2024-10-01')
      },
      {
        id: '2',
        strategyId: '2',
        strategyName: 'RSI Momentum',
        startDate: '2023-06-01',
        endDate: '2024-09-15',
        initialCapital: 50000,
        finalValue: 54150,
        totalReturn: 8.3,
        trades: 189,
        winningTrades: 111,
        winRate: 58.9,
        runDate: new Date('2024-09-15')
      }
    ];

    res.json({
      success: true,
      data: {
        backtests,
        total: backtests.length
      }
    });
  } catch (error) {
    console.error('Get backtests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching backtest results'
    });
  }
});

// @route   POST /api/trading/backtests
// @desc    Run backtest for a strategy
// @access  Private
router.post('/backtests', auth, async (req, res) => {
  try {
    const { strategyId, startDate, endDate, initialCapital } = req.body;

    // Mock backtest execution
    const backtest = {
      id: Date.now().toString(),
      strategyId,
      startDate,
      endDate,
      initialCapital,
      status: 'running',
      runDate: new Date()
    };

    // Update user's trading stats
    req.user.tradingStats.totalBacktests += 1;
    req.user.tradingStats.lastActiveDate = new Date();
    await req.user.save();

    // Simulate async backtest completion
    setTimeout(() => {
      // In a real app, you'd update the backtest status in the database
      console.log(`Backtest ${backtest.id} completed`);
    }, 5000);

    res.status(201).json({
      success: true,
      message: 'Backtest started successfully',
      data: {
        backtest
      }
    });
  } catch (error) {
    console.error('Run backtest error:', error);
    res.status(500).json({
      success: false,
      message: 'Error running backtest'
    });
  }
});

// @route   GET /api/trading/portfolio
// @desc    Get user's portfolio data
// @access  Private
router.get('/portfolio', auth, async (req, res) => {
  try {
    // Mock portfolio data
    const portfolio = {
      totalValue: 127500,
      totalGainLoss: 27500,
      totalGainLossPercent: 27.5,
      positions: [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 50,
          avgCost: 180.25,
          currentPrice: 195.50,
          marketValue: 9775,
          gainLoss: 762.50,
          gainLossPercent: 8.44
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          shares: 30,
          avgCost: 350.75,
          currentPrice: 380.25,
          marketValue: 11407.50,
          gainLoss: 885,
          gainLossPercent: 8.41
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          shares: 25,
          avgCost: 140.80,
          currentPrice: 155.20,
          marketValue: 3880,
          gainLoss: 360,
          gainLossPercent: 10.23
        }
      ],
      performance: {
        dayChange: 1250,
        dayChangePercent: 0.99,
        weekChange: -875,
        weekChangePercent: -0.68,
        monthChange: 3200,
        monthChangePercent: 2.58,
        yearChange: 27500,
        yearChangePercent: 27.5
      }
    };

    res.json({
      success: true,
      data: {
        portfolio
      }
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio data'
    });
  }
});

// @route   GET /api/trading/market-data/:symbol
// @desc    Get market data for a symbol
// @access  Private
router.get('/market-data/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Mock market data
    const marketData = {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Corporation`,
      price: 195.50,
      change: 2.75,
      changePercent: 1.43,
      volume: 45670000,
      marketCap: 3020000000000,
      pe: 28.5,
      high52Week: 199.75,
      low52Week: 164.25,
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: {
        marketData
      }
    });
  } catch (error) {
    console.error('Get market data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching market data'
    });
  }
});

module.exports = router;