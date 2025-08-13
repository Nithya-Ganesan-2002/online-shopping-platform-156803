const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce Backend API',
      version: '1.0.0',
      description: 'RESTful API for user authentication, products, cart, orders, and payment integration.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide a valid JWT issued by the login/register endpoints.',
        },
      },
    },
    security: [],
    tags: [
      { name: 'Auth', description: 'User authentication and profile' },
      { name: 'Products', description: 'Product browsing and management' },
      { name: 'Cart', description: 'Shopping cart management' },
      { name: 'Orders', description: 'Order processing and history' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
