const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, required: true, trim: true },
    isAdmin: { type: Boolean, default: false },
    address: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

// Pre-save password hash
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

/**
 * PUBLIC_INTERFACE
 * comparePassword
 * Instance method to compare a raw password with the hashed password.
 */
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
