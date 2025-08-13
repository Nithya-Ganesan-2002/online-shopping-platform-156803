const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * PUBLIC_INTERFACE
 * auth
 * Verify JWT bearer token and attach the authenticated user to req.user.
 * Requires Authorization: Bearer <token> header.
 */
async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(new ApiError(401, 'Unauthorized'));
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-password');
    if (!user) {
      return next(new ApiError(401, 'Unauthorized'));
    }
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

/**
 * PUBLIC_INTERFACE
 * requireAdmin
 * Ensure the authenticated user has admin privileges.
 */
function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return next(new ApiError(403, 'Forbidden: admin access required'));
  }
  next();
}

module.exports = {
  auth,
  requireAdmin,
};
