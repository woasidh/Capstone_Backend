const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://disboard13.kro.kr/',
      changeOrigin: false
    })
  );
};