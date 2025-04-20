// scripts/generate-openapi.js
define = require('swagger-jsdoc');
const swaggerJSDoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wanderlust API',
      version: '1.0.0',
    },
  },
  apis: ['./src/controllers/**/*.ts'], // 根據實際路徑調整
};

const swaggerSpec = swaggerJSDoc(options);
const yaml = YAML.stringify(swaggerSpec, 10);
fs.writeFileSync(path.join(__dirname, '../openapi.yaml'), yaml);

console.log('OpenAPI YAML generated at openapi.yaml');
