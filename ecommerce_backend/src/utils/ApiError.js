class ApiError extends Error {
  /**
   * PUBLIC_INTERFACE
   * Create a new ApiError instance for standardized HTTP error responses.
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {object} [details] - Optional extra details for debugging
   */
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
