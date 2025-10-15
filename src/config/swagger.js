const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.app.name,
      version: config.app.version,
      description: 'Backend blockchain application API documentation',
      license: {
        name: 'ISC',
      },
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: config.server.env === 'development' ? [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development server (localhost)',
      },
      {
        url: `http://127.0.0.1:${config.server.port}`,
        description: 'Development server (127.0.0.1)',
      },
      {
        url: `http://0.0.0.0:${config.server.port}`,
        description: 'Development server (0.0.0.0)',
      }
    ] : [
      {
        url: 'https://yourdomain.com',
        description: 'Production server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message'
                },
                status: {
                  type: 'integer',
                  description: 'HTTP status code'
                }
              }
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['OK', 'DEGRADED', 'ERROR'],
              description: 'Overall health status'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of health check'
            },
            service: {
              type: 'string',
              description: 'Service name'
            },
            version: {
              type: 'string',
              description: 'Service version'
            },
            environment: {
              type: 'string',
              description: 'Environment (development, production, etc.)'
            },
            uptime: {
              type: 'number',
              description: 'Service uptime in seconds'
            },
            memory: {
              type: 'object',
              description: 'Memory usage information'
            },
            checks: {
              type: 'object',
              properties: {
                database: {
                  type: 'string',
                  enum: ['healthy', 'unhealthy', 'checking...'],
                  description: 'Database health status'
                },
                redis: {
                  type: 'string',
                  enum: ['healthy', 'unhealthy', 'checking...'],
                  description: 'Redis health status'
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ],
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { 
      background-color: #2c3e50; 
    }
    .swagger-ui .topbar .download-url-wrapper .select-label {
      color: white;
    }
  `,
  customSiteTitle: `${config.app.name} API Documentation`,
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};