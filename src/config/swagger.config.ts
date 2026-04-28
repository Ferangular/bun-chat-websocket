import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat WebSocket API',
      version: '1.0.0',
      description: 'API documentation for chat application with WebSocket support',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3200}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User display name',
            },
            password: {
              type: 'string',
              description: 'User password (for login only)',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT authentication token',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        Group: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Group identifier',
            },
            name: {
              type: 'string',
              description: 'Group name',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Group creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date',
            },
            _count: {
              type: 'object',
              properties: {
                groupMessages: {
                  type: 'integer',
                  description: 'Number of messages in group',
                },
              },
            },
          },
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Message identifier',
            },
            content: {
              type: 'string',
              description: 'Message content',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Message creation date',
            },
            sender: {
              $ref: '#/components/schemas/User',
            },
            groupId: {
              type: 'string',
              format: 'uuid',
              description: 'Group identifier',
            },
          },
        },
      },
    },
  },
  apis: ['./src/handlers-rest/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
export const swaggerSetup = swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Chat API Documentation'
});
