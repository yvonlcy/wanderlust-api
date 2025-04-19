import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wanderlust Travel API',
      version: '1.0.0',
      description: 'RESTful API for hotel management & booking',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Hotel: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            star: { type: 'integer' },
            city: { type: 'string' },
            country: { type: 'string' },
            address: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // scan all route / controller files for JSDoc
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'],
})
