import { swaggerSpec } from '../config/swagger';
import { writeFileSync } from 'fs';

writeFileSync('./openapi.json', JSON.stringify(swaggerSpec, null, 2));
