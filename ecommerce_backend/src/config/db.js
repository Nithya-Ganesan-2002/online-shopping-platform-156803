const mongoose = require('mongoose');

/**
 * PUBLIC_INTERFACE
 * connectDB
 * Connect to MongoDB using Mongoose and the MONGO_URI environment variable.
 * Throws an error if the connection fails or if MONGO_URI is not provided.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set. Please configure it in your environment variables.');
  }

  // Mongoose recommended options
  mongoose.set('strictQuery', true);

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
}

module.exports = {
  connectDB,
};
