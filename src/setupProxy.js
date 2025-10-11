const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy only /api routes to backend (local dev)
  app.use('/api', createProxyMiddleware({
    target: process.env.REACT_APP_PROXY || 'http://localhost:5001',
    changeOrigin: true,
    secure: false,
    logLevel: 'silent',
    onProxyReq(proxyReq, req, res) {
      // preserve headers if needed
    }
  }));
};
