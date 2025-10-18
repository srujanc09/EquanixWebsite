const express = require('express');
const { auth, optionalAuth, requireSubscription } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseAdmin = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('Supabase admin client initialized in trading routes');
  } catch (e) {
    console.error('Failed to initialize Supabase admin in trading routes', e?.message || e);
  }
}

const router = express.Router();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STRAT_FILE = path.join(DATA_DIR, 'strategies.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function saveLocalStrategy(strategy) {
  try {
    ensureDataDir();
    let list = [];
    if (fs.existsSync(STRAT_FILE)) {
      const raw = fs.readFileSync(STRAT_FILE, 'utf8');
      list = JSON.parse(raw || '[]');
    }
    list.unshift(strategy);
    fs.writeFileSync(STRAT_FILE, JSON.stringify(list, null, 2), 'utf8');
    return strategy;
  } catch (err) {
    console.error('Error saving local strategy:', err);
    throw err;
  }
}

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

// @route   POST /api/trading/generate
// @desc    Generate a strategy from a prompt using the Python generator
// @access  Private
router.post('/generate', optionalAuth, async (req, res) => {
  try {
    const prompt = req.body.prompt || '';

    const scriptPath = path.join(__dirname, '..', 'scripts', 'generate_strategy.py');

    // Try to resolve a reliable python executable:
    // - honor process.env.PYTHON
    // - try Windows 'py' launcher (py -3)
    // - use system 'where' (Windows) or 'which' (Unix) to find python
    function findPythonExecutable() {
      try {
        if (process.env.PYTHON && fs.existsSync(process.env.PYTHON)) {
          return process.env.PYTHON;
        }
      } catch (e) {
        // ignore
      }

      // Try Windows launcher 'py' which can be more reliable on Windows
      try {
        const check = require('child_process').spawnSync('py', ['-3', '-c', 'import sys;print(sys.executable)']);
        if (check && check.status === 0 && check.stdout) {
          const p = check.stdout.toString().trim();
          if (p && fs.existsSync(p)) return p;
        }
      } catch (e) {
        // ignore
      }

      try {
        const whichCmd = process.platform === 'win32' ? 'where' : 'which';
        const which = require('child_process').spawnSync(whichCmd, ['python']);
        if (which && which.status === 0 && which.stdout) {
          const out = which.stdout.toString().trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
          // prefer entries that are not the Microsoft Store alias
          for (const p of out) {
            if (!p.toLowerCase().includes('windowsapps') && fs.existsSync(p)) return p;
          }
          if (out.length && fs.existsSync(out[0])) return out[0];
        }
      } catch (e) {
        // ignore
      }

      return null;
    }

    const runPython = (script, input) => new Promise((resolve) => {
      const resolved = findPythonExecutable();
      const tries = [];
      if (resolved) tries.push(resolved);
      // Add common fallbacks. 'py' is the Windows launcher and should be tried before raw 'python'
      tries.push('py');
      tries.push('python3');
      tries.push('python');

      let stdout = '';
      let stderr = '';
      let tried = 0;

      const attempt = () => {
        const cmd = tries[tried];
        // If using the py launcher, pass -3 to ensure Python 3
        const args = (cmd === 'py') ? ['-3', script] : [script];
        console.log(`Attempting to spawn python command: ${cmd} ${args.join(' ')}`);
        const proc = spawn(cmd, args);
        stdout = '';
        stderr = '';

        proc.stdout.on('data', (data) => { stdout += data.toString(); });
        proc.stderr.on('data', (data) => { stderr += data.toString(); });

        proc.on('error', (err) => {
          console.error(`Python spawn error (${cmd}):`, err.message || err);
          tried += 1;
          if (tried < tries.length) attempt(); else resolve({ stdout: '', stderr: String(err) });
        });

        proc.on('close', (code) => {
          console.log(`Python process (${cmd}) exited with code=${code}`);
          if (stdout) console.log('Python stdout:', stdout.slice(0, 2000));
          if (stderr) console.error('Python stderr:', stderr.slice(0, 2000));
          resolve({ stdout, stderr, exitCode: code });
        });

        try {
          if (proc.stdin && input) {
            proc.stdin.write(input);
            proc.stdin.end();
          }
        } catch (e) {
          // ignore
        }
      };

      attempt();
    });

    const result = await runPython(scriptPath, prompt);
    const { stdout, stderr } = result;

    if (stderr && !stdout) {
      console.error('Generator stderr:', stderr);
    }

    // Extract code between markers
    const startTag = '###CODE_START###';
    const endTag = '###CODE_END###';
    let code = '';
    if (stdout && stdout.includes(startTag) && stdout.includes(endTag)) {
      code = stdout.split(startTag)[1].split(endTag)[0].trim();
    } else {
      code = stdout || stderr || '';
    }

    const defaultName = (prompt || '').split('\n')[0].trim().slice(0, 60) || `Generated Strategy ${new Date().toISOString()}`;
    const strategy = {
      id: Date.now().toString(),
      name: req.body.name || defaultName,
      description: req.body.description || (prompt || '').slice(0, 200),
      code: startTag + '\n' + code + '\n' + endTag,
      created_at: new Date().toISOString(),
      owner: req.user ? (req.user._id || req.user.id || req.user) : null,
      status: 'generated'
    };

    try {
      // Log a short preview and size to help diagnose client parsing issues
      const preview = (strategy.code || '').slice(0, 800).replace(/\r/g, '');
      console.log('Persisting generated strategy. code length=', (strategy.code || '').length);
      console.log('Strategy code preview:\n', preview);
      saveLocalStrategy(strategy);
    } catch (e) {
      console.error('Failed to persist generated strategy locally:', e);
    }

  // Return strategy both nested (legacy) and top-level so frontend code and
  // external callers (PowerShell) can read it reliably.
  res.json({ success: true, data: { strategy }, strategy, message: 'generated and complete' });
  } catch (error) {
    console.error('Generate strategy error:', error);
    res.status(500).json({ success: false, message: 'Error generating strategy' });
  }
});

// @route POST /api/trading/strategies/persist
// @desc Persist a strategy to Supabase (if configured) or local file storage fallback
// @access Private
router.post('/strategies/persist', auth, async (req, res) => {
  try {
    const payload = req.body;

    if (!payload || !payload.code) {
      return res.status(400).json({ success: false, message: 'Invalid strategy payload' });
    }

    // Try Supabase upsert if admin client is available
    if (supabaseAdmin) {
      try {
        const row = {
          id: payload.id || undefined,
          owner_id: req.user && (req.user._id || req.user.id) ? (req.user._id || req.user.id) : null,
          name: payload.name || null,
          description: payload.description || null,
          code: payload.code,
          metadata: payload.metadata || null,
          created_at: payload.created_at || new Date().toISOString()
        };

        const { data, error } = await supabaseAdmin.from('strategies').upsert(row).select().maybeSingle();
        if (error) throw error;
        return res.json({ success: true, data: { strategy: data }, message: 'persisted to supabase' });
      } catch (e) {
        console.error('Supabase persist error:', e?.message || e);
        // fall through to local persist
      }
    }

    // Local fallback
    const strategy = saveLocalStrategy(Object.assign({}, payload, { owner: req.user ? (req.user._id || req.user.id) : null }));
    return res.json({ success: true, data: { strategy }, message: 'persisted locally' });
  } catch (error) {
    console.error('Persist strategy error:', error);
    res.status(500).json({ success: false, message: 'Error persisting strategy' });
  }
});

module.exports = router;
