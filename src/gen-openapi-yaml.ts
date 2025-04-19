import { swaggerSpec } from './src/config/swagger'
import yaml from 'yaml'
import fs from 'fs'

fs.writeFileSync('./openapi.yaml', yaml.stringify(swaggerSpec))
