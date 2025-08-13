const { auth, requireAdmin } = require('./auth');
const validate = require('./validate');
const { notFound, errorHandler } = require('./error');

// This file exports middleware for convenience
module.exports = {
  auth,
  requireAdmin,
  validate,
  notFound,
  errorHandler,
};
