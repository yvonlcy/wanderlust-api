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

const app = new Koa()
const router = new Router()

router.get('/', (ctx) => {
  ctx.body = { msg: 'wanderlust API is alive~~~' }
})

app.use(json())
app.use(logger())
app.use(bodyParser())

// Swagger UI (load openapi.yaml directly)
const swaggerSpec = yamljs.load(path.join(__dirname, '../openapi.yaml'))
app.use(mainRouter.routes()).use(mainRouter.allowedMethods())

app.use(swaggerUi.serve)
app.use(swaggerUi.setup(swaggerSpec, { routePrefix: '/docs', swaggerOptions: { docExpansion: 'none' } }))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
