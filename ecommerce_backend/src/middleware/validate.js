const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * PUBLIC_INTERFACE
 * validate
 * Run after express-validator checkers to handle validation errors.
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array({ onlyFirstError: true });
    return next(new ApiError(422, 'Validation failed', details));
  }
  next();
}

module.exports = validate;
