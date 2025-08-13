require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

let server;

// Connect to DB then start server
connectDB()
  .then(() => {
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server due to DB connection error:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

module.exports = server;
