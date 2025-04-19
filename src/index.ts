import Koa from 'koa'
import Router from 'koa-router'
import json from 'koa-json'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import health from './routes/health'
import { PORT } from './config/env'
import authRouter from './routes/auth'

const app = new Koa()
const router = new Router()

router.get('/', (ctx) => {
  ctx.body = { msg: 'wanderlust API is alive~~~' }
})

app.use(json())
app.use(logger())
app.use(bodyParser())

app.use(health.routes()).use(health.allowedMethods())
app.use(authRouter.routes()).use(authRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
