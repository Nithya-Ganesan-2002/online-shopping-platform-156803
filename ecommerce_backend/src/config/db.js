const mongoose = require('mongoose');

/**
 * PUBLIC_INTERFACE
 * connectDB
 * Connect to MongoDB using Mongoose and the MONGO_URI environment variable.
 * - If MONGO_URI is missing or the connection fails, and ALLOW_NO_DB=true (or NODE_ENV=test),
 *   the function will log a warning and resolve without throwing, allowing the app to start
 *   without a database connection (useful for CI or health checks).
 * - Otherwise, it throws an error to prevent the server from starting in a bad state.
 *
 * Returns the mongoose instance when connected successfully, or null when DB is intentionally skipped.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  const allowNoDb =
    String(process.env.ALLOW_NO_DB || '').toLowerCase() === 'true' ||
    process.env.NODE_ENV === 'test';

  // Mongoose recommended options
  mongoose.set('strictQuery', true);

  if (!uri) {
    const msg =
      'MONGO_URI is not set. Please configure it in your environment variables.';
    if (allowNoDb) {
      console.warn(`${msg} Starting without a database connection because ALLOW_NO_DB is enabled.`);
      return null;
    }
    throw new Error(msg);
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });

    // Connection events logging
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    return mongoose;
  } catch (err) {
    if (allowNoDb) {
      console.warn(
        `MongoDB connection failed: ${err.message}. Continuing without DB because ALLOW_NO_DB is enabled.`
      );
      return null;
    }
    // Re-throw to be handled by the caller (server will exit)
    throw err;
  }
}

module.exports = {
  connectDB,
};
