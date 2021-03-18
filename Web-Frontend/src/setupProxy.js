const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/auth/google',
    createProxyMiddleware({
      target: 'http://ec2-3-133-119-255.us-east-2.compute.amazonaws.com:3000/'
    })
  );
};