import Koa from 'koa'
import Router from 'koa-router'
import json from 'koa-json'
import logger from 'koa-logger'
import health from './routes/health'

const app = new Koa()
const router = new Router()

router.get('/', (ctx) => {
  ctx.body = { msg: 'wanderlust API is alive~~~' }
})

app.use(json())
app.use(logger())

app.use(health.routes()).use(health.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
