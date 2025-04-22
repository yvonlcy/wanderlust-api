import Koa from 'koa'
import Router from 'koa-router'
import json from 'koa-json'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import { PORT } from './config/env'
import mainRouter from './routes/index'
import swaggerUi from 'swagger-ui-koa'
import yamljs from 'yamljs'
import path from 'path'

import errorMiddleware from './middleware/errorMiddleware'
import { closeDb, connectDb } from './services/db'

const app = new Koa()
const router = new Router()

router.get('/', (ctx) => {
  ctx.body = { msg: 'wanderlust API is alive~~~' }
})

app.use(errorMiddleware)
app.use(json())
app.use(logger())
app.use(bodyParser())

// Swagger UI (load openapi.yaml directly)
const swaggerSpec = yamljs.load(path.join(__dirname, '../openapi.yaml'))
app.use(mainRouter.routes()).use(mainRouter.allowedMethods())

app.use(swaggerUi.serve)
app.use(
  swaggerUi.setup(swaggerSpec, { routePrefix: '/docs', swaggerOptions: { docExpansion: 'none' } }),
)


if (require.main === module) {
  connectDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
      })
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err)
      process.exit(1)
    })
}

// Graceful shutdown on SIGINT
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Closing MongoDB connection...')
  await closeDb()
  console.log('MongoDB connection closed. Exiting process.')
  process.exit(0)
})

export default app
