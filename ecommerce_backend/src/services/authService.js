const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * PUBLIC_INTERFACE
 * register
 * Create a new user, hashing the password and returning a JWT.
 */
async function register({ name, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, 'Email already in use');
  }
  const user = await User.create({ name, email, password });
  const token = signToken(user._id, user.isAdmin);
  return { token, user: sanitizeUser(user) };
}

/**
 * PUBLIC_INTERFACE
 * login
 * Validate credentials and return a JWT.
 */
async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');
  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid email or password');
  const token = signToken(user._id, user.isAdmin);
  return { token, user: sanitizeUser(user) };
}

/**
 * PUBLIC_INTERFACE
 * getProfile
 * Fetch the authenticated user profile by id.
 */
async function getProfile(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  return sanitizeUser(user);
}

function signToken(userId, isAdmin) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set in environment');
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ sub: userId.toString(), role: isAdmin ? 'admin' : 'user' }, secret, { expiresIn });
}

function sanitizeUser(u) {
  const obj = u.toObject();
  delete obj.password;
  return obj;
}

module.exports = {
  register,
  login,
  getProfile,
};
