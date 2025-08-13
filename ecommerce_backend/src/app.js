const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

// Initialize express app
const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging
app.use(morgan('dev'));

app.set('trust proxy', true);

// OpenAPI JSON
app.get('/openapi.json', (req, res) => {
  const host = req.get('host');
  const actualPort = req.socket.localPort;
  let protocol = req.protocol;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  res.json(dynamicSpec);
});

// Swagger UI
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');           // may or may not include port
  let protocol = req.protocol;          // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec, { explorer: true })(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
