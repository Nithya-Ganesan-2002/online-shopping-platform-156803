const ApiError = require('../utils/ApiError');

/**
 * PUBLIC_INTERFACE
 * notFound
 * Express middleware to handle 404 routes.
 */
function notFound(req, res, next) {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

/**
 * PUBLIC_INTERFACE
 * errorHandler
 * Centralized error handling middleware.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err instanceof ApiError && err.statusCode ? err.statusCode : 500;
  const payload = {
    status: 'error',
    message: err.message || 'Internal Server Error',
  };

  // Provide details only in non-production env
  if (process.env.NODE_ENV !== 'production' && err.details) {
    payload.details = err.details;
  }

  res.status(status).json(payload);
}

module.exports = {
  notFound,
  errorHandler,
};
